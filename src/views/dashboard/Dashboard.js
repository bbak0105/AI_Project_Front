import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useTheme } from '@mui/material/styles';

// components
import SalesOverview from './components/SalesOverview';
import ProductCodeOverview from './components/ProductCodeOverview';
import MostFrequency from './components/MostFrequency';

const Dashboard = () => {
  /* SalesOverview */
  const [salesOverviewLoading, setSalesOverviewLoading] = useState(true);
  const [salesOverviewList, setSalesOverviewList] = useState([]);
  const [salesOverviewTop3, setSalesOverviewTop3] = useState([]);
  const [salesOverviewGridCategory, setSalesOverviewGridCategory] = useState([]);
  const [salesOverviewGridWarehouse, setSalesOverviewGridWarehouse] = useState([]);
  
  /* MostFrequency */
  const [mostFrequency, setMostFrequency] = useState([]);
  
  /* ProductCodeOverview*/
  const [productCodeOverview, setProductCodeOverview] = useState([]);

  // theme
  const theme = useTheme();
  const primary = theme.palette.primary.main;

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

          for(let index=0; index < WarehouseBasedJSON.OrderDemand.length; index++){
              gridDataWarehouseBasedJSON.push({
                  'OrderDemand': WarehouseBasedJSON.OrderDemand[index],
                  'Warehouse': WarehouseBasedJSON.Warehouse[index],
                  'Year': WarehouseBasedJSON.Year[index]
              });
          }

          /* [Top5] */
          const top3ProductCategory = [];
          const productCategoryJSON = data.productCategoryJSON;

          for(let index = 0; index < 3; index++) {
              top3ProductCategory.push({
                  'rank': index + 1,
                  'name': productCategoryJSON.index[index],
                  'count': productCategoryJSON.count[index],
                  'label': index === 0 ? "High" : 
                              index === 1 ? "Medium" :
                                  index === 2 ? "Low" : "Normal",
                  'pbg' : index === 0 ? 'error.main' :
                              index === 1 ? 'secondary.main' :
                                  index === 2 ? 'primary.main' : primary.main
              })
          }

          /* [2]. mostFrequency */
          const code = {
            'frequency': data['productCodeJSON']['count'].length > 0 ? data['productCodeJSON']['count'].length : 0,
            'count': data['productCodeJSON']['count'][0],
            'name': data['productCodeJSON']['index'][0]
          }
          const category = {
            'frequency': data['productCategoryJSON']['count'].length > 0 ? data['productCategoryJSON']['count'].length : 0,
            'count': data['productCategoryJSON']['count'][0],
            'name': data['productCategoryJSON']['index'][0]
          }
          const OrderDemand = {
            'most': `${data['monthlyJSON']['Month'][0]} ${data['monthlyJSON']['Year'][0]}`,
            'count': data['monthlyJSON']['OrderDemand'][0]
          }
          const warehouse = {
            'frequency': data['warehouseJSON']['count'].length > 0 ? data['warehouseJSON']['count'].length : 0,
            'count': data['warehouseJSON']['count'][0],
            'name': data['warehouseJSON']['index'][0]
          }
          
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

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>     
          {/* 왼쪽 큰 대시보드 */}
          <Grid item xs={12} lg={8}>
            <SalesOverview 
              isLoading={salesOverviewLoading}
              analysisList={salesOverviewList}
              top3ProductCategory={salesOverviewTop3}
              gridDataProductCategoryBasedJSON={salesOverviewGridCategory}
              gridDataWarehouseBasedJSON={salesOverviewGridWarehouse}
            />
          </Grid>

          {/* 오른쪽 대시보드 */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProductCodeOverview data={productCodeOverview}/>
              </Grid>
              <Grid item xs={12}>
                <MostFrequency data={mostFrequency}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
