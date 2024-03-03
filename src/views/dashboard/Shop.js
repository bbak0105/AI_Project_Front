import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardContent, Typography, Grid, Rating, Tooltip, Fab, Snackbar, AlertTitle, Button } from '@mui/material';
import img1 from 'src/assets/images/products/s4.jpg';
import img2 from 'src/assets/images/products/s5.jpg';
import img3 from 'src/assets/images/products/s7.jpg';
import img4 from 'src/assets/images/products/s11.jpg';
import logo1 from 'src/assets/images/logos/logo.png';
import logo2 from 'src/assets/images/logos/logo2.png';
import logo3 from 'src/assets/images/logos/logo3.png';
import { Stack } from '@mui/system';
import { IconBasket } from '@tabler/icons';
import BlankCard from 'src/components/shared/BlankCard';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Lottie from 'lottie-react';
import confirm from 'src/assets/lottie/confirm.json';

const ecoCard = [
    {
        title: '1 Report',
        photo: logo3,
        price: 1,
        rating: 4,
        count: 1
    },
    {
        title: '12 Report',
        photo: logo1,
        salesPrice: 12,
        price: 10,
        rating: 5,
        count: 12
    },
    {
        title: '30 Report',
        photo: logo2,
        salesPrice: 30,
        price: 25,
        rating: 5,
        count: 30
    },
];

const Blog = () => {
    const theme = useTheme();
    const [openAlert, setOpenAlert] = useState(false);
    const [targetIndex, setTargetIndex] = useState();
    const [openLottie, setOpenLottie] = useState(false);

    return (
        <>
            <br/>
            <Grid container spacing={3}>
                {ecoCard.map((product, index) => (
                    <Grid item sm={12} md={4} lg={3} key={index}>
                        <BlankCard>
                            <Typography component={Link} to="#">
                                <img src={product.photo} alt="img" width="100%" />
                            </Typography>
                            <Tooltip title="Buy it">
                                <Fab
                                    size="small"
                                    color="secondary"
                                    sx={{ bottom: '75px', right: '15px', position: 'absolute' }}
                                    onClick={(e) => {
                                        if(index === 0) { 
                                            setTargetIndex(0);
                                            setOpenAlert(true);
                                        } else if (index === 1) {
                                            setTargetIndex(1);
                                            setOpenAlert(true);
                                        } else {
                                            setTargetIndex(2);
                                            setOpenAlert(true);
                                        }
                                    }}
                                >
                                    <IconBasket size="16" color='white'/>
                                </Fab>
                            </Tooltip>
                            <CardContent sx={{ p: 3, pt: 2 }}>
                                <Typography variant="h6">{product.title}</Typography>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                                    <Stack direction="row" alignItems="center">
                                        <Typography variant="h6">${product.price}</Typography>
                                        <Typography color="textSecondary" ml={1} sx={{ textDecoration: 'line-through' }}>
                                            {index !== 0 ? "$" : ""}{product.salesPrice}
                                        </Typography>
                                    </Stack>
                                    <Rating name="read-only" size="small" value={product.rating} readOnly />
                                </Stack>
                            </CardContent>
                        </BlankCard>

                        {openAlert && (index === targetIndex) && <>
                            <br/>
                            <Alert severity="info">
                                <AlertTitle>Confirm</AlertTitle>
                                $ {product.price} 구매 하시겠습니까? <br/>
                                익월결제에 합산되어 청구됩니다.
                            </Alert>
                            <div style={{
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems:'center', 
                                marginTop: '10px'}}
                            >
                                <Button 
                                    variant="outlined" 
                                    size='small'  
                                    style={{ marginRight: '20px'}}
                                    onClick={(e) => setOpenAlert(false)}
                                >
                                    취소
                                </Button>
                                <Button 
                                    variant="contained" 
                                    size='small' 
                                    onClick={(e) => {
                                        setOpenAlert(false)
                                        setOpenLottie(true)
                                    }}
                                >
                                    확인
                                </Button>
                            </div>
                        </>}

                        {openLottie && (index === targetIndex) &&
                        <div style={{
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems:'center', 
                            marginTop: '20px'}}
                        >
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
                        </div>
                        }
                    </Grid>
                ))}
            </Grid>

        </>
    );
};

export default Blog;
