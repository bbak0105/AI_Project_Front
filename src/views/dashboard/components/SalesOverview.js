import React from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import { AgGridReact } from 'ag-grid-react';
import { InfinitySpin } from "react-loader-spinner";
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
require("ag-grid-community/styles/ag-grid.css");
require("ag-grid-community/styles/ag-theme-alpine.css");
require("ag-grid-enterprise");


const SalesOverview = (props) => {
    // props
    const gridDataProductCategoryBasedJSON = props.gridDataProductCategoryBasedJSON;
    const gridDataWarehouseBasedJSON = props.gridDataWarehouseBasedJSON;
    const top3ProductCategory = props.top3ProductCategory;
    const analysisList = props.analysisList;
    const isLoading = props.isLoading;

    // Chart Color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const green_main = theme.palette.success.main;
    const green_light = theme.palette.success.light;
    const red_main = theme.palette.error.main;
    const yello_main = theme.palette.warning.main;
    const info_main = theme.palette.info.main;

    useEffect(() => {

    }, [isLoading]);

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

    const yearlyOptions = {
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
        colors: [green_main, green_light],
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
            categories: analysisList  && analysisList.yearlyJSON? analysisList.yearlyJSON.index : [],
            axisBorder: { show: false },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        }
    };

    const monthlyOptions = {
        chart: {
            height: 300,
            type: "area",
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
            curve: 'smooth',
        },
        colors: [green_main, green_light],
        fill: {
            type: "gradient",
            gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        },
        xaxis: {
          categories: analysisList && analysisList.monthlyJSON? analysisList.monthlyJSON.Month : [],
        }
    };

    const productOptions = {
        chart: {
            type: "area",
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
            categories: analysisList && analysisList.productCategoryJSON? analysisList.productCategoryJSON.index : [],
        },
        plotOptions: {
            heatmap: {
              colorScale: {
                ranges: [
                    {
                        from: 0,
                        to: 1000,
                        color: theme.palette.secondary.main,
                        name: 'low',
                    },
                    {
                        from: 1001,
                        to: 10000,
                        color: theme.palette.success.main,
                        name: 'medium',
                    },
                    {
                        from: 10001,
                        to: 50000,
                        color: yello_main,
                        name: 'high',
                    },
                    {
                        from: 50001,
                        to: 500000,
                        color: red_main,
                        name: 'max'
                    }
                ]
              }
            }
        }
    }

    // [2]. chart series
    const warehouseChartSeries = [
        {
            name: 'Count',
            data: analysisList && analysisList.warehouseJSON ? analysisList.warehouseJSON.count : []
        }
    ];

    const yearlySeries = [
        {
            name: 'Count',
            data: analysisList && analysisList.yearlyJSON ? analysisList.yearlyJSON.count : []
        }
    ];

    const monthlySeries = [
        {
            name: 'Count',
            data: analysisList && analysisList.monthlyJSON ? analysisList.monthlyJSON.OrderDemand : []
        }
    ];

    const productSeries = [
        {
            name: 'Count',
            data: analysisList && analysisList.productCategoryJSON ? analysisList.productCategoryJSON.count : []
        }
    ];
    
    // Grid Setting
    const [columnProductCategoryDefs] = React.useState([
        { field: 'ProductCategory', rowGroup: true, hide: true, resizable: true },
        { field: 'Warehouse', sortable: true, filter: true, resizable: true },
        { field: 'OrderDemand', sortable: true, filter: true, resizable: true },
    ]);

    const [columnWarehouseDefs] = React.useState([
        { field: 'Warehouse', rowGroup: true, hide: true, resizable: true },
        { field: 'Year', sortable: true, filter: true, resizable: true },
        { field: 'OrderDemand', sortable: true, filter: true, resizable: true },
    ]);

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
                            color={secondary}
                        />
                    </div>
                    <br/>
                </>
            )
        } else {
            return(<></>)
        }
    }

    const products = top3ProductCategory && top3ProductCategory.length > 0 ? top3ProductCategory : [];

    return (
        <>  
            <Loading/>


            <DashboardCard title="Product Category Top 3">
                <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                    <Table
                        aria-label="simple table"
                        sx={{
                            whiteSpace: "nowrap",
                            mt: 2
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Rank
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Count
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Frequency
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={product.rank}>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: "15px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {product.rank}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {product.name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                            {product.count}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            sx={{
                                                fontWeight: 'bold',
                                                px: "4px",
                                                background: index === 0 ? 
                                                    theme.palette.error.main :
                                                        index === 1 ?
                                                            theme.palette.success.main :
                                                                theme.palette.secondary.main,
                                                color:'#fff'
                                            }}
                                            size="small"
                                            label={product.label}
                                        ></Chip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </DashboardCard>

            <br/><br/>

            <DashboardCard title="Product Category Overview">
            { analysisList ?
                (
                    <Chart
                        options={productOptions}
                        series={productSeries}
                        type="heatmap"
                        height="300px"
                    />
                ) : ( <></> )
            }
            </DashboardCard>

            <br/><br/>

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
            
            <br/><br/>

            <DashboardCard title="Yearly OrderDemand">
            { analysisList ?
                (
                    <Chart
                        options={yearlyOptions}
                        series={yearlySeries}
                        type="bar"
                        height="300px"
                    />
                ) : ( <></> )
            }
            </DashboardCard>

            <br/><br/>

            <DashboardCard title="Monthly OrderDemand">
            { analysisList ?
                (
                    <Chart
                        options={monthlyOptions}
                        series={monthlySeries}
                        type="area"
                        height="300px"
                    />
                ) : ( <></> )
            }
            </DashboardCard>

            <br/><br/>

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

            <br/><br/>

            <DashboardCard title="Warehouse Grouping Data">
                <div className="ag-theme-alpine" style={{ width: '100%', height: 300, margin: '0 auto' }}>
                    <AgGridReact
                        rowData={gridDataWarehouseBasedJSON}
                        columnDefs={columnWarehouseDefs}
                        defaultColDef={{ flex: 1 }}
                    >
                    </AgGridReact>
                </div>
            </DashboardCard>
        </>
    );
};

export default SalesOverview;