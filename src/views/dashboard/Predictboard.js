import React, { useState, useEffect, useRef } from 'react';
import { 
  Fab, 
  FormControl, 
  InputAdornment, 
  InputLabel, 
  OutlinedInput, 
  TextField, 
  Tooltip, 
  Typography,
  Stack,
  Avatar,
  Alert,
  Grid,
  Box,
  Chip
} from '@mui/material';
import { 
  IconArrowDown,
  IconArrowDownRight,
  IconBrandOffice,
  IconCurrencyDollar,
  IconDownload,
  IconInputSearch,
  IconTable
} from '@tabler/icons';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { InfinitySpin } from 'react-loader-spinner';
import RecentTransactions from './components/MostFrequency';
import * as _ from 'lodash';

const _EXCEL = require("exceljs");

const Predictboard = () => {  
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';
  const errorlight = '#fdede8';
  const green_main = theme.palette.success.main;

  // state
  const [predictData, setPredictData] = useState();
  const [excelData, setExcelData] = useState([]);
  const [begInv, setBegInv] = useState();
  const [minInv, setMinInv] = useState();
  const [maxInv, setMaxInv] = useState();
  const [cost1, setCost1] = useState();
  const [cost2, setCost2] = useState();
  const [cost3, setCost3] = useState();
  const [cost4, setCost4] = useState();
  const [cost5, setCost5] = useState();
  const [cost6, setCost6] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenEmptyAlert, setIsOpenEmptyAlert] = useState(false);
  const [isOpenTypeAlert, setIsOpenTypeAlert] = useState(false);


  // input validate checking
  const isValidate = () => {
    let validate = false;

    if(!begInv || !minInv || !maxInv || 
      !cost1 || !cost2 || !cost3 || !cost4 || !cost5 || !cost6) {
        setIsOpenEmptyAlert(true);
    } else if(
      typeof(begInv) !== 'number' ||
      typeof(minInv) !== 'number' ||
      typeof(maxInv) !== 'number' ||
      typeof(cost1) !== 'number' ||
      typeof(cost2) !== 'number' ||
      typeof(cost3) !== 'number' ||
      typeof(cost4) !== 'number' ||
      typeof(cost5) !== 'number' ||
      typeof(cost6) !== 'number') {
        setIsOpenEmptyAlert(false);
        setIsOpenTypeAlert(true);
    } else {
      setIsOpenEmptyAlert(false);
      setIsOpenTypeAlert(false);
      validate = true;
    }
    return validate;
  }

  useEffect(() => {
    if(predictData && predictData.length > 0) {
      const targetExcelData = {
        'M1': predictData[0]['M1'],
        'M2': predictData[1]['M2'],
        'M3': predictData[2]['M3'],
        'M4': predictData[3]['M4'],
        'M5': predictData[4]['M5'],
        'M6': predictData[5]['M6'],
        'target': predictData[6]['target'],
        'begInv': begInv,
        'minInv': minInv,
        'maxInv': maxInv,
        'cost1': cost1,
        'cost2': cost2,
        'cost3': cost3,
        'cost4': cost4,
        'cost5': cost5,
        'cost6': cost6
      };

      const addExcelData = excelData.concat(targetExcelData);
      setExcelData(addExcelData);
    }
  }, [predictData])

  useEffect(() => {

  }, [isLoading])

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: 'Month',
      color: secondary,
      data: predictData && predictData.length > 0 ? 
        [predictData[0]['M1'], predictData[1]['M2'], predictData[2]['M3'],
         predictData[3]['M4'], predictData[4]['M5'], predictData[5]['M6']] 
        : []
      ,
    },
  ];

  // loading
  const Loading = () => {
    if(isLoading) {
        return (
            <>
                <div 
                    style={{
                        display: 'flex', 
                        justifyContent: 'center',
                        transition: 'all 1s ease-out'
                    }}
                >
                    <InfinitySpin 
                        width='200'
                        color={theme.palette.secondary.main}
                    />
                </div>
                <br/>
            </>
        )
    } else {
        return(<></>)
    }
  }

  const validateAndAwakeAPI = () => {
    const validate = isValidate();

    if(!validate) return;

    setIsLoading(true);

    fetch("/getLSTMData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        begInv: begInv,
        minInv: minInv,
        maxInv: maxInv,
        costs: [cost1,cost2,cost3,cost4,cost5,cost6]
      })
    }).then(
      res => res.json()
    ).then(
      data => {
        data[0]['M1'] = Math.floor(data[0]['M1']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        data[1]['M2'] = Math.floor(data[1]['M2']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        data[2]['M3'] = Math.floor(data[2]['M3']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        data[3]['M4'] = Math.floor(data[3]['M4']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        data[4]['M5'] = Math.floor(data[4]['M5']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        data[5]['M6'] = Math.floor(data[5]['M6']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        data[6]['target'] = Math.floor(data[6]['target']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        setPredictData(data);
      }
    ).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      {/* <Chip label="success" color="success" variant="outlined"/> */}
      <Stack direction="row" spacing={1}>
        {excelData && excelData.length > 0 ?
          excelData.map((item,index) => {
            return <Chip label={`${index+1}번 레포트`} color="success" variant="fulfilled"/>
          }) 
        : <></>}
        {excelData && excelData.length > 0 && 
          <>
            <IconDownload 
              color={green_main} 
              marginTop='5px'
              style={{ cursor: 'pointer'}}
              onClick={(e) => {
                if(!excelData) {
                  alert("[ExcelDownload]. 비정상적 접근입니다.");
                  return;
                }

                const workbook = new _EXCEL.Workbook();
                workbook.creator = localStorage.getItem('user');
                workbook.created = new Date();
                workbook.modified = new Date(); 

                const excelSheet = workbook.addWorksheet("Product_CODE1359's Predict Data");
                const excelColumns = [];

                /* Input Data */
                excelColumns.push({ header: "기초재고", key: "begInv", width: 15 });
                excelColumns.push({ header: "최소유지재고", key: "minInv", width: 15 });
                excelColumns.push({ header: "저장가능재고", key: "maxInv", width: 15 });
                excelColumns.push({ header: "M1_예상가격", key: "cost1", wxidth: 15 });
                excelColumns.push({ header: "M2_예상가격", key: "cost2", width: 15 });
                excelColumns.push({ header: "M3_예상가격", key: "cost3", width: 15 });
                excelColumns.push({ header: "M4_예상가격", key: "cost4", width: 15 });
                excelColumns.push({ header: "M5_예상가격", key: "cost5", width: 15 });
                excelColumns.push({ header: "M6_예상가격", key: "cost6", width: 15 });

                /* Output Data */
                excelColumns.push({ header: "M1_적정재고량", key: "M1", width: 20 });
                excelColumns.push({ header: "M2_적정재고량", key: "M2", width: 20 });
                excelColumns.push({ header: "M3_적정재고량", key: "M3", width: 20 });
                excelColumns.push({ header: "M4_적정재고량", key: "M4", width: 20 });
                excelColumns.push({ header: "M5_적정재고량", key: "M5", width: 20 });
                excelColumns.push({ header: "M6_적정재고량", key: "M6", width: 20 });
                excelColumns.push({ header: "최소비용금액", key: "target", width: 30 });

                /* Colum Setting */
                excelSheet.columns = excelColumns;

                /* Excel Data Setting */
                for(let i=0; i<excelData.length; i++) {
                  const targetExcelData = excelData[i];
                  excelSheet.addRow(targetExcelData);
                }

                for(let i=0; i<excelData.length+1; i++) {
                  excelSheet.columns.forEach((columnItem, columnIndex) => {
                    /* 테두리 설정 */
                    excelSheet.getRow(i+1).getCell(columnIndex + 1).border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                        bottom: { style: "thin" },
                    };

                    /* 첫 행(컬럼) 스타일 설정 */
                    if (i === 0) {
                        /* 색상 및 스타일 설정 */
                        const whiteColorColumns = [1,2,3,4,5,6,7,8,9];

                        if (whiteColorColumns.includes(columnIndex + 1)) {
                            excelSheet.getRow(1).getCell(columnIndex + 1).fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: { argb: "FFFFFF" },
                                bgColor: { argb: "FFFFFF" },
                            };
                        } else {
                            excelSheet.getRow(1).getCell(columnIndex + 1).fill = {
                                type: "pattern",
                                pattern: "solid",
                                fgColor: { argb: "CCCCCC" },
                                bgColor: { argb: "CCCCCC" },
                            };
                        }

                        /* 정렬 */
                        excelSheet.getRow(1).getCell(columnIndex + 1).alignment = {
                            vertical: "middle",
                            horizontal: "center",
                            wrapText: true
                        };

                        /* 첫 행 폰트 굵게 */
                        excelSheet.getRow(1).font = {
                            bold: true
                        };

                        /* 첫 행 높이 넓게 */
                        excelSheet.getRow(1).height = 40;
                      } else {
                        /* 정렬 */
                        excelSheet.getRow(i + 1).getCell(columnIndex + 1).alignment = {
                            vertical: "center",
                            horizontal: "center",
                        };
                    }
                  });
                }

              /* Excel 파일 다운로드 */
              workbook.xlsx
                  .writeBuffer()
                  .then((data) => {
                      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                      const url = window.URL.createObjectURL(blob);
                      const anchor = document.createElement("a");
                      anchor.href = url;
                      anchor.download = `Product_CODE1359's Predict Data.xlsx`;
                      anchor.click();
                      window.URL.revokeObjectURL(url);
                  })
                  .catch((error) => {
                      alert("엑셀 다운로드 오류!");
                  });
              }}
            />
            <br/><br/>
          </>
        }
      </Stack>

      {/* <Loading/> */}
      {/* [1]. Minimal TotalCost */}
      <DashboardCard
        title="Minimal TotalCost (LSTM)"
        action={
          <Fab color="secondary" size="medium" sx={{color: '#ffffff'}}>
            <IconCurrencyDollar width={24} />
          </Fab>
        }
        footer={
          <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="100px" />
        }
      >
        <>
          <Typography variant="h3" fontWeight="700" mt="-20px">
            {predictData && predictData[6]['target'] ? `$ ${predictData[6]['target']}` : 'Loading...'}
          </Typography>
          <Stack direction="row" spacing={1} my={1} alignItems="center">
            <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
              <IconArrowDown width={20} color="#FA896B" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              적정 주문량 예측 및 최소 비용 예측을 위해 하단에 값을 입력해주세요.
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {`(Input Data For Predict)`}
            </Typography>
          </Stack>
        </>
      </DashboardCard>

      <br/><br/>

      {/* [2]. Predict OverView */}
      {predictData ? 
        <>
          <DashboardCard title="Reasonable Inventory">
            <>
              <Timeline
                className="theme-timeline"
                nonce={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                sx={{
                  p: 0,
                  mb: '-40px',
                  '& .MuiTimelineConnector-root': {
                    width: '1px',
                    backgroundColor: '#efefef'
                  },
                  [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.5,
                    paddingLeft: 0,
                  },
                }}
              >
                <TimelineItem>
                  <TimelineOppositeContent>1개월 후 적정 주문량</TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" variant="outlined" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{predictData && predictData[0]["M1"] ? predictData[0]["M1"] : 0}</TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineOppositeContent>2개월 후 적정 주문량</TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="secondary" variant="outlined" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography fontWeight="600">{predictData && predictData[1]["M2"] ? predictData[1]["M2"] : 0}</Typography>{' '}
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineOppositeContent>3개월 후 적정 주문량</TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="success" variant="outlined" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{predictData && predictData[2]["M3"] ? predictData[2]["M3"] : 0}</TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineOppositeContent>4개월 후 적정 주문량</TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="warning" variant="outlined" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography fontWeight="600">{predictData && predictData[3]["M4"] ? predictData[3]["M4"] : 0}</Typography>{' '}
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineOppositeContent>5개월 후 적정 주문량</TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="error" variant="outlined" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography fontWeight="600">{predictData && predictData[4]["M5"] ? predictData[4]["M5"] : 0}</Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineOppositeContent>6개월 후 적정 주문량</TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="success" variant="outlined" />
                  </TimelineSeparator>
                  <TimelineContent>{predictData && predictData[5]["M6"] ? predictData[5]["M6"] : 0}</TimelineContent>
                </TimelineItem>
              </Timeline>
              <br/>
            </>
          </DashboardCard>
          <br/><br/>
        </>
      : <></>}

      {isLoading ?
        <>
          <Loading/>
          <br/><br/>
        </> 
        : <></>}

      {/* [3]. Input Data For Predict */}
      <DashboardCard
        title="Input Data For Forecasting"
        action={
          <Fab 
            color="secondary" 
            size="medium" 
            sx={{color: '#ffffff'}}
          >
            <IconInputSearch width={24} onClick={validateAndAwakeAPI}/>
          </Fab>
        }
      >

        {isOpenEmptyAlert &&
          <>
            <Alert variant="outlined" severity="error">
              모든 값을 전부 채워주세요.
            </Alert>
            <br/>
          </>
        }

        {isOpenTypeAlert &&
          <>
            <Alert variant="outlined" severity="warning">
              모든 값은 전부 숫자 타입으로 작성해야 합니다.
            </Alert>
            <br/>
          </>
        }

        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Typography variant="subtitle1" gutterBottom marginLeft={'10px'}>
            <b>1. 기초 재고 입력</b>
          </Typography>
          
          <Tooltip title="보유 중인 기초 재고량을 입력하세요.">
            <FormControl fullWidth sx={{ m: 1, width: '40ch' }}>
              <InputLabel htmlFor="outlined-adornment-amount" color='secondary'>Amount</InputLabel>
              <OutlinedInput
                id="begInv"
                color="secondary"
                value={begInv}
                onChange={(e) => setBegInv(e.target.value * 1)}
                startAdornment={<InputAdornment position="start">Count</InputAdornment>}
                label="Amount"
                size='medium'
              />
            </FormControl>
          </Tooltip>

          <br /><br />

          <Typography variant="subtitle1" gutterBottom marginLeft={'10px'}>
            <b>2. 최소 유지 재고 입력</b>
          </Typography>
          
          <Tooltip title="최소로 유지할 재고량을 입력하세요.">
            <FormControl fullWidth sx={{ m: 1, width: '40ch' }}>
              <InputLabel htmlFor="outlined-adornment-amount" color='secondary'>Amount</InputLabel>
              <OutlinedInput
                id="minInv"
                color="secondary"
                value={minInv}
                onChange={(e) => setMinInv(e.target.value * 1)}
                startAdornment={<InputAdornment position="start">Count</InputAdornment>}
                label="Amount"
                size='medium'
              />
            </FormControl>
          </Tooltip>
          
          <br /><br />

          <Typography variant="subtitle1" gutterBottom marginLeft={'10px'}>
            <b>3. 저장 최대 가능 재고 입력</b>
          </Typography>
          
          <Tooltip title="Warehouse에 최대로 저장이 가능한 재고량을 입력하세요.">
            <FormControl fullWidth sx={{ m: 1, width: '40ch' }}>
              <InputLabel htmlFor="outlined-adornment-amount" color='secondary'>Amount</InputLabel>
              <OutlinedInput
                id="maxInv"
                color="secondary"
                value={maxInv}
                onChange={(e) => setMaxInv(e.target.value * 1)}
                startAdornment={<InputAdornment position="start">Count</InputAdornment>}
                label="Amount"
                size='medium'
              />
            </FormControl>
          </Tooltip>


          <br/><br/>

          <Typography variant="subtitle1" gutterBottom marginLeft={'10px'}>
            <b>4. 향후 6개월 예상 가격 입력</b>
          </Typography>

          <Tooltip title="1개월 후에 예상되는 가격을 입력하세요.">
            <TextField
              id="cost1"
              label="1 Month Predict Cost"
              value={cost1}
              color="secondary"
              onChange={(e) => setCost1(e.target.value * 1)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />     
          </Tooltip>
          
          <Tooltip title="2개월 후에 예상되는 가격을 입력하세요.">
            <TextField
              id="cost2"
              label="2 Month Predict Cost"
              color="secondary"
              value={cost2}
              onChange={(e) => setCost2(e.target.value * 1)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </Tooltip>
          
          <Tooltip title="3개월 후에 예상되는 가격을 입력하세요.">
            <TextField
              id="cost3"
              label="3 Month Predict Cost"
              color="secondary"
              value={cost3}
              onChange={(e) => setCost3(e.target.value * 1)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />  
          </Tooltip>
          
          <Tooltip title="4개월 후에 예상되는 가격을 입력하세요.">
            <TextField
              id="cost4"
              label="4 Month Predict Cost"
              color="secondary"
              value={cost4}
              onChange={(e) => setCost4(e.target.value * 1)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />     
          </Tooltip>
        
          <Tooltip title="5개월 후에 예상되는 가격을 입력하세요.">
            <TextField
              id="cost5"
              label="5 Month Predict Cost"
              color="secondary"
              value={cost5}
              onChange={(e) => setCost5(e.target.value * 1)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />   
          </Tooltip>
          
          <Tooltip title="6개월 후에 예상되는 가격을 입력하세요.">
            <TextField
              id="cost6"
              value={cost6}
              color="secondary"
              onChange={(e) => setCost6(e.target.value * 1)}
              label="6 Month Predict Cost"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
              variant="standard"
            /> 
          </Tooltip>

          <br/><br/><br/>
        </Box>
      </DashboardCard>      
    </PageContainer>
    
  );
};

export default Predictboard;

