# [서강대학원] 프랙티컴 AI 재고관리 수요예측 프로젝트 프론트

## 📌 Development Environment

## 📌 Frontend Flow

### `Excel Upload`
> ✏️ 엑셀 데이터를 분석하기 위하여, 사용자에게 엑셀 데이터를 받을 수 있는 페이지 입니다. <br/>
> 데이터가 정상적으로 업로드 되면, 플라스크 서버에 axios로 파일 데이터를 보냅니다. 헤더는 multipart로 설정합니다. <br/>
> 정상적으로 보내지면, localStorage에 저장된 분석 가능 횟수를 차감합니다.

```javascript
const onUploadFile = (e) => {
    if(!fileData) {
        setIsShowAlert(true);
        return;
    }

    setIsShowAlert(false);

    const formData = new FormData();
    formData.append('file', fileData);

    axios({
      baseURL: "http://127.0.0.1:5000",
      url: '/uploadData',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    .then(response => {
        if(response.data === "Uplaod Success!") {
            const findingUser = localStorage.getItem("user");
            const userCounting = localStorage.getItem(`${findingUser}_counting`)
            localStorage.setItem(`${findingUser}_counting`, userCounting-1);
            window.location.href = "/dashboard";
        }
    })
    .catch(error => {
        console.error(error);
    });
};
```
[↑ 전체코드보기](https://github.com/bbak0105/AI_Project_Front/blob/main/src/views/dashboard/FileUploadBox.js)

---

### `Main Dashboard`
> ✏️ 엑셀 파일이 업로드 되면, 가장 먼저 나오는 메인보드 입니다. <br/>
> getAnalysisList API가 호출되어 플라스크에서 분석된 데이터들을 state에 담아놓습니다. <br/>
> 해당 데이터들은 자식 컴포넌트인 `<SalesOverview/>` 에서 'react-apexcharts'를 통해 차트로 뿌려집니다.

```javascript
useEffect(() => {
    fetch("/getAnalysisList").then(
      res => res.json()
    ).then(
      data => {
        if(data) {
          /* [1]. saleOverview */
          /* [Chart - MonthlyJSON] 년도와 달 함께 묶어서 라벨링 */
          const tempYear = data.monthlyJSON.Year;
          const tempMonth = data.monthlyJSON.Month;
          const newLabelingList = [];

          for(let i=0; i<tempYear.length; i++) {
              const newLabeling = `${tempYear[i]} ${tempMonth[i]}`;
              newLabelingList.push(newLabeling);
          }

          data.monthlyJSON.Month = newLabelingList;

          /* [Grid - ProductCategoryBasedJSON] 그리드에 뿌려주기 위해 데이터 행으로 합치기 */
          const gridDataProductCategoryBasedJSON = [];
          const productCategoryBasedJSON = data.productCategoryBasedJSON;

          for(let index=0; index < productCategoryBasedJSON.OrderDemand.length; index++){
              gridDataProductCategoryBasedJSON.push({
                  'OrderDemand': productCategoryBasedJSON.OrderDemand[index],
                  'ProductCategory': productCategoryBasedJSON.ProductCategory[index],
                  'Warehouse': productCategoryBasedJSON.Warehouse[index]
              });
          }

          /* [Grid - WarehouseBasedJSON] 그리드에 뿌려주기 위해 데이터 행으로 합치기 */
          const gridDataWarehouseBasedJSON = [];
          const WarehouseBasedJSON = data.warehouseBasedJSON;
          ...

          /* [Top5] */
          const top3ProductCategory = [];
          const productCategoryJSON = data.productCategoryJSON;
          ...
          
          /* [2]. mostFrequency */
          const code = {
            'frequency': data['productCodeJSON']['count'].length > 0 ? data['productCodeJSON']['count'].length : 0,
            'count': data['productCodeJSON']['count'][0],
            'name': data['productCodeJSON']['index'][0]
          }
          ...

          setSalesOverviewList(data)
          setSalesOverviewTop3(top3ProductCategory);
          setSalesOverviewGridCategory(gridDataProductCategoryBasedJSON);
          setSalesOverviewGridWarehouse(gridDataWarehouseBasedJSON);
          setMostFrequency([code, category, OrderDemand, warehouse]);
          setProductCodeOverview(data["productCodeJSON"]);
        }
      }
    )
    .catch(error => console.log('dashboard 데이터 불러오기 오류', error))
    .finally(() => setSalesOverviewLoading(false))
  },[salesOverviewLoading]);
```
[↑ 전체코드보기](https://github.com/bbak0105/AI_Project_Front/blob/main/src/views/dashboard/Dashboard.js)

---

### `Chart & Grid`
> ✏️ 메인보드 데이터의 자식 컴포넌트 입니다. 메인보드에서 뿌려주는 데이터를 토대로 차트와 그리드를 생성합니다. <br/>
> 차트는 `react-apexcharts`, 그리드는 `ag-grid-react` 라이브러리를 사용하였습니다.

```javaScript
// props
const gridDataProductCategoryBasedJSON = props.gridDataProductCategoryBasedJSON;
const gridDataWarehouseBasedJSON = props.gridDataWarehouseBasedJSON;
...

// Chart Color
const theme = useTheme();
const primary = theme.palette.primary.main;
...

// Chart Setting
// [1]. chart Options
const warehouseOptions = {
    chart: {
        type: 'bar',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
            show: true,
        },
        height: 300,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            barHeight: '60%',
            columnWidth: '42%',
            borderRadius: [6],
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'all',
        },
    },
    stroke: {
        show: true,
        width: 5,
        lineCap: "butt",
        colors: ["transparent"],
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    colors: [secondary, theme.palette.secondary.light],
    yaxis: { tickAmount: 4 },
    grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
            lines: {
                show: false,
            },
        },
    },
    xaxis: {
        categories: analysisList  && analysisList.warehouseJSON? analysisList.warehouseJSON.index : [],
        axisBorder: { show: false },
    },
    tooltip: {
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        fillSeriesColor: false,
    }
};
...

// [2]. chart series
const warehouseChartSeries = [
    {
        name: 'Count',
        data: analysisList && analysisList.warehouseJSON ? analysisList.warehouseJSON.count : []
    }
];
...

// [3]. Grid Setting
const [columnProductCategoryDefs] = React.useState([
    { field: 'ProductCategory', rowGroup: true, hide: true, resizable: true },
    { field: 'Warehouse', sortable: true, filter: true, resizable: true },
    { field: 'OrderDemand', sortable: true, filter: true, resizable: true },
]);
...

return (
    <>
        ...
        {/* [react-apexcharts] Warehouse Chart */}
        <DashboardCard title="Warehouse Overview">
            { analysisList ?
                (
                    <Chart
                        options={warehouseOptions}
                        series={warehouseChartSeries}
                        type="bar"
                        height="300px"
                    />
                ) : ( <></> )
            }
        </DashboardCard>
        ...
        {/* [ag-grid-react] Product Category Grid */}
        <DashboardCard title="Product Category Grouping Data">
            <div className="ag-theme-alpine" style={{ width: '100%', height: 500, margin: '0 auto' }}>
                <AgGridReact
                    rowData={gridDataProductCategoryBasedJSON}
                    columnDefs={columnProductCategoryDefs}
                    defaultColDef={{ flex: 1 }}
                >
                </AgGridReact>
            </div>
        </DashboardCard>
        ...
    </>
)
```
[↑ 전체코드보기](https://github.com/bbak0105/AI_Project_Front/blob/main/src/views/dashboard/components/SalesOverview.js)

---

### `Stock Form`
> ✏️ 적정 재고량을 파악하기 위해, 기존에 있는 재고들을 폼에 담아 보내줄 화면입니다.


---
### `Get PredictData`
> ✏️ LSTM 예측 데이터를 가져오기 위해 getLSTMData API를 호출합니다. 호출 직전에 유효성 검사도 진행합니다. <br/>
> fetch를 사용하여 POST 방식으로 총 4개의 데이터를 JSON으로 보내고, 받아온 비동기 데이터가 준비되면 state에 넣어줍니다. <br/>
> 모든 작업이 끝나면, finally로 로딩창을 닫아줍니다.

```javascript
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
        ...
        data[6]['target'] = Math.floor(data[6]['target']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        setPredictData(data);
      }
    ).finally(() => {
      setIsLoading(false);
    })
  }
```
<br/>

### `Data-To-Excel`
> ✏️ 예측한 데이터를 엑셀로 변환하여 다운로드 받을 수 있도록 합니다.
> 비정상적 접근에 대해 방어코드를 설정하고, exceljs를 사용하여 엑셀 데이터를 만듭니다.
> CSS 설정 후에 다운로드가 가능하게끔 anchor를 활용하여 엑셀 다운로드를 진행합니다.

```javascript
const _EXCEL = require("exceljs");

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
...

/* Output Data */
excelColumns.push({ header: "M1_적정재고량", key: "M1", width: 20 });
...

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
```
[↑ 전체코드보기](https://github.com/bbak0105/AI_Project_Front/blob/main/src/views/dashboard/Predictboard.js)

---

### `Shop`
> 사용자가 분석 가능 횟수를 구매하면, Lottie로 애니메이션이 보여집니다. <br/>
> 간단히 localStorage에서 횟수를 차감하게끔 하였습니다.

```javaScript
 <Lottie 
    animationData={confirm} 
    style={{width: '80px'}}
    loop={false}
    onComplete={(e) => {
        const findingUser = localStorage.getItem("user");
        const userCounting = localStorage.getItem(`${findingUser}_counting`)
        const targetCount = index === targetIndex ? product.count : 0
        localStorage.setItem(`${findingUser}_counting`, Number(userCounting) + targetCount);  

        setOpenLottie(false)
        setOpenAlert(false)
        setTargetIndex();
    }}
/>
```
[↑ 전체코드보기](https://github.com/bbak0105/AI_Project_Front/blob/main/src/views/dashboard/Shop.js)

---

### `Pages`
> ✏️ 페이지에 lazy를 적용하여 동적 import 적용

```javascript
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const FileUploadBox = Loadable(lazy(() => import('../views/dashboard/FileUploadBox')))
const Predictboard = Loadable(lazy(() => import('../views/dashboard/Predictboard')))
const Shop = Loadable(lazy(() => import('../views/dashboard/Shop')))
...
```
<br/>

> ✏️ 각 기능에 맞는 라우터 이름 지정

```javascript
const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/auth/login" /> },
      { path: '/fileUpload', exact: true, element: <FileUploadBox/> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/predict', exact: true, element: <Predictboard /> },
      { path: '/shop', exact: true, element: <Shop /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];
```
[↑ 전체코드보기](https://github.com/bbak0105/AI_Project_Front/blob/main/src/routes/Router.js)
