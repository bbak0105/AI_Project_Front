# [서강대학원] 프랙티컴 AI 재고관리 수요예측 프로젝트 프론트

### 📌 Development Environment

<br/>

### 📌 Technology Used
### `Excel Upload`
> ✏️ 엑셀 데이터를 분석하기 위하여, 사용자에게 엑셀 데이터를 받을 수 있는 페이지 입니다.

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

<br/>

### 📌 Technology Used
### `Main Dashboard`
> ✏️ 엑셀 파일이 업로드 되면, 가장 먼저 나오는 [메인보드](https://github.com/bbak0105/AI_Project_Front/blob/main/src/views/dashboard/Dashboard.js) 입니다.
> getAnalysisList API가 플라스크에서 호출되어 기본적인 데이터들을 state에 담아놓습니다.
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

---

### `Pages`
> ✏️ [페이지에 lazy를 적용](https://github.com/bbak0105/AI_Project_Front/blob/main/src/routes/Router.js)하여 동적 import 적용

```javascript
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const FileUploadBox = Loadable(lazy(() => import('../views/dashboard/FileUploadBox')))
const Predictboard = Loadable(lazy(() => import('../views/dashboard/Predictboard')))
const Shop = Loadable(lazy(() => import('../views/dashboard/Shop')))
...
```
<br/>

> ✏️ 각 기능에 맞는 [라우터](https://github.com/bbak0105/AI_Project_Front/blob/main/src/routes/Router.js) 이름 지정

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
<br/>
