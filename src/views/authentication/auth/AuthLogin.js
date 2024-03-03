import React from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { accounts } from 'src/availableAccounts/accounts';


const AuthLogin = ({ title, subtitle, subtext }) => {
    const [idValue, setIdValue] = React.useState("");
    const [passwordValue, setPasswordValue] = React.useState("");
    const [isOpenErrorAlert, setIsOpenErrorAlert] = React.useState(false);
    const [isOpenWarningAlert, setIsOpenWarningAlert] = React.useState(false);
    const [isOpenSuccessAlert, setIsOpenSuccessAlert] = React.useState(false);
    
    const initializeInput = () => {
        setIdValue("");
        setPasswordValue("");
    }

    const validateLogin = () => {
        // 기존 Alert 초기화 
        setIsOpenErrorAlert(false)
        setIsOpenWarningAlert(false)

        // 사용자가 둘 중에 하나라도 입력하지 않았을 경우
        if(!idValue || !passwordValue) { 
            setIsOpenErrorAlert(true);
            initializeInput();
        } else { // 사용자가 일단 둘다 입력했을 때,
            let searchingCorrect = false;
            let correctId = "";
            let correcPassword = "";

            accounts.forEach((item,index) => {
                if(item.id === idValue && item.password === passwordValue) {
                    correctId = item.id;
                    correcPassword = item.password;
                    searchingCorrect = true;
                }
            });

            if(searchingCorrect) {
                // 가능한 횟수 초기화
                localStorage.setItem("user", correctId);
                localStorage.setItem(`${correctId}_counting`, 6)
                setIsOpenSuccessAlert(true);
                window.location.href = "/fileUpload";
            } else {
                initializeInput();
                setIsOpenWarningAlert(true);
            }
        }
    }

    return(
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            { isOpenErrorAlert && (
                <>
                    <Alert variant="outlined" severity="error">
                        아이디와 비밀번호를 모두 입력해주세요.
                    </Alert>
                    <br/>
                </>
            )}

            { isOpenWarningAlert && (
                <>
                    <Alert variant="outlined" severity="warning">
                        아이디와 비밀번호가 일치하지 않습니다.
                    </Alert>
                    <br/>
                </>
            )}

            { isOpenSuccessAlert && (
                <>
                    <Alert variant="outlined" severity="success">
                        로그인에 성공하였습니다!
                    </Alert>
                    <br/>
                </>
            )}

            <Stack>
                <Box>
                    <Typography 
                        variant="subtitle1"
                        fontWeight={600} 
                        component="label" 
                        htmlFor='username' 
                        mb="5px"
                    >
                        ID
                    </Typography>
                    <CustomTextField 
                        id="username" 
                        value={idValue}
                        onChange={(e) => {
                            setIdValue(e.target.value)
                        }}
                        variant="outlined" 
                        fullWidth 
                        color="secondary"
                    />
                </Box>
                <Box mt="25px">
                    <Typography 
                        variant="subtitle1"
                        fontWeight={600} 
                        component="label" 
                        htmlFor='password'
                        mb="5px" 
                    >
                        Password
                    </Typography>
                    <CustomTextField 
                        id="password" 
                        value={passwordValue}
                        onChange={(e) => {
                            setPasswordValue(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                validateLogin();
                            }
                        }}
                        type="password" 
                        variant="outlined" 
                        fullWidth 
                        color="secondary"
                    />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked color='secondary'/>}
                            label="Remeber this Device"
                        />
                    </FormGroup>
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="secondary"
                    variant="outlined"
                    size="large"
                    fullWidth
                    type="submit"
                    onClick={(e) => {
                        validateLogin();
                    }}
                    // component={Link}
                    // to="/"
                >
                    Sign In
                </Button>
            </Box>
            {subtitle}
        </>
    )
}

export default AuthLogin;
