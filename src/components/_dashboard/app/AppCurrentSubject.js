// material
import { Box, Card, CardHeader, Tooltip } from '@material-ui/core';
// material
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
const date = new Date();
// ----------------------------------------------------------------------

export default function AppCurrentSubject() {
  const theme = useTheme();
  const [diem, setDiem] = useState(0);
  const [dinhDuongThieu, setDinhDuongThieu] = useState([]);
  const [dinhDuongThua, setDinhDuongThua] = useState([]);
  const [monAnNenAn, setMOnAnNenAn] = useState('');
  const [dinhDuongThieuMax, setDinhDuongThieuMax] = useState('');

  useEffect(() => {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    console.log('AppCurrentSubject bi goi');
    (async () => {
      const user = await Auth.currentAuthenticatedUser();
      try {
        const a = await API.graphql(
          graphqlOperation(
            `query MyQuery($creatDate: String = "", $email: String = "") {
            listCustomers(filter: {email: {eq: $email}}) {
              items {
                FoodDeitalForReports(filter: {creatDate: {eq: $creatDate}}) {
                  items {
                    Food {
                      Energy
                      VitaminA
                      VitaminB1
                      VitaminB12
                      VitaminB2
                      VitaminB5
                      VitaminB9
                      VitaminB6
                      VitaminC
                      VitaminE
                      VitaminH
                      VitaminK
                      VitaminPP
                      VitaminD
                    }
                    id
                    _deleted
                    unit
                    time
                  }
                }
                dateOfBirth
              }
            }
          }          
          `,
            {
              creatDate: dateString,
              email: user.attributes.email
            }
          )
        );
        console.log('AppCurrentSubject do an trong ngay');

        const userAge = ((dateString) => {
          const today = new Date();
          const birthDate = new Date(dateString);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age -= 1;
          }
          return age;
        })(a.data.listCustomers.items[0].dateOfBirth);

        try {
          a.data.listFoodDeitalForReports = a.data.listCustomers.items[0].FoodDeitalForReports;
          delete a.data.listCustomers;

          // xoa null trong data
          a.data.listFoodDeitalForReports.items = a.data.listFoodDeitalForReports.items.filter(
            (x) => x.Food !== null && x._deleted !== true
          );

          // Tinh data theo 100gr
          Object.keys(a.data.listFoodDeitalForReports.items[0].Food).forEach((key) => {
            a.data.listFoodDeitalForReports.items[0].Food[key] =
              parseInt(a.data.listFoodDeitalForReports.items[0].Food[key], 10) *
              (parseInt(a.data.listFoodDeitalForReports.items[0].unit, 10) / 100);
            if (Number.isNaN(a.data.listFoodDeitalForReports.items[0].Food[key]))
              a.data.listFoodDeitalForReports.items[0].Food[key] = 0;
          });

          // Tinh tong data
          const data = a.data.listFoodDeitalForReports.items.reduce((a, b) => {
            Object.keys(a.Food).forEach((key) => {
              const tmp = parseInt(b.Food[key], 10) * (parseInt(b.unit, 10) / 100);
              if (!Number.isNaN(tmp)) a.Food[key] += tmp;
            });
            return a;
          }).Food;
          console.log('AppCurrentSubject tong an trong ngay', data);

          // lay du lieu chuan
          const chuan = (
            await API.graphql(
              graphqlOperation(
                `query MyQuery {
                listNutritionStandards {
                  items {
                    Calcium
                    Phosphorous
                    Magnesium
                    VitaminA
                    VitaminB1
                    VitaminB12
                    VitaminB2
                    VitaminB6
                    VitaminB9
                    VitaminC
                    VitaminD
                    VitaminE
                    VitaminK
                    startAge
                    endAge
                  }
                }
              }
                      
            `
              )
            )
          ).data.listNutritionStandards.items.find(
            (x) => x.startAge < userAge && x.endAge > userAge
          );
          console.log('chuan', chuan);
          // lay du lieu chuan end

          // tao du lieu data bieu thi
          const bieuThiArray = [
            'VitaminA',
            'VitaminB1',
            'VitaminB12',
            'VitaminB2',
            'VitaminB6',
            'VitaminB9',
            'VitaminC',
            'VitaminD',
            'VitaminE',
            'VitaminK'
          ];

          console.log('data', data);
          console.log('chuan', chuan);

          // tao du lieu data bieu thi end

          // tinh diem sally
          let diem = 0;
          const dinhDuongThieu = [];
          const dinhDuongThua = [];
          let dinhDuongThieuMaxKey = '';
          let dinhDuongThieuMaxValue = 0;
          bieuThiArray.forEach((key) => {
            diem += Math.abs(parseInt((data[key] / chuan[key]) * 100, 10) - 100);
            if (parseInt((data[key] / chuan[key]) * 100, 10) - 100 < 0) {
              dinhDuongThieu.push(key);
              if (
                dinhDuongThieuMaxValue <
                Math.abs(parseInt((data[key] / chuan[key]) * 100, 10) - 100)
              ) {
                dinhDuongThieuMaxValue = Math.abs(
                  parseInt((data[key] / chuan[key]) * 100, 10) - 100
                );
                dinhDuongThieuMaxKey = key;
              }
            } else if (parseInt((data[key] / chuan[key]) * 100, 10) - 100 > 0) {
              dinhDuongThua.push(key);
            }
          });
          console.log('dinhDuongThieu', dinhDuongThieu);

          setDiem(parseInt(100 - diem / bieuThiArray.length, 10));
          setDinhDuongThieu(dinhDuongThieu);
          setDinhDuongThua(dinhDuongThua);
          // tinh diem sally end

          // tim mon an nen an
          if (dinhDuongThieuMaxKey !== '') {
            const monAnNenAn = (
              await API.graphql(
                graphqlOperation(
                  `query MyQuery {
                    listFoods {
                      items {
                        _deleted
                        VitaminA
                        VitaminB1
                        VitaminB12
                        VitaminB2
                        VitaminB5
                        VitaminB6
                        VitaminB9
                        VitaminC
                        VitaminD
                        VitaminE
                        VitaminH
                        VitaminK
                        VitaminPP
                        name
                      }
                    }
                  }  
              `
                )
              )
            ).data.listFoods.items
              .filter((x) => x._deleted !== true)
              .reduce((a, b) => (a[dinhDuongThieuMaxKey] > b[dinhDuongThieuMaxKey] ? a : b)).name;
            setMOnAnNenAn(monAnNenAn);
            setDinhDuongThieuMax(dinhDuongThieuMaxKey);
          }
          // tim mon an nen an end
        } catch (error) {
          console.log('AppCurrentSubject err', error);
        }
      } catch (error) {
        console.log('AppCurrentSubject err', error);
      }
    })();
  }, []);

  return (
    <Card>
      <CardHeader title="サリー先生のアドバイス" />
      <Box height="400px">
        <Box
          boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
          margin="20px"
          marginLeft="152px"
          marginBottom="100px"
          padding="40px"
          borderRadius="14% 86% 13% 87% / 77% 12% 88% 23%"
          fontSize="19px"
          height="-webkit-fill-available"
        >
          <Box>こんにちは！今日は{diem}点って感じだね。</Box>

          {dinhDuongThieu.length > 0 && (
            <Box display="flex">
              {dinhDuongThieu.length < 3 ? (
                <h4>・{dinhDuongThieu.join(' ,')}</h4>
              ) : (
                <Tooltip title={dinhDuongThieu.join(' ,')}>
                  <Box flexShrink="0">
                    <h4>・{dinhDuongThieu[0]} ,...</h4>
                  </Box>
                </Tooltip>
              )}
              が足りないね。
            </Box>
          )}

          {dinhDuongThua.length > 0 && (
            <Box display="flex">
              {dinhDuongThua.length < 3 ? (
                <h4>・{dinhDuongThua.join(' ,')}</h4>
              ) : (
                <Tooltip title={dinhDuongThua.join(' ,')}>
                  <h4>・{dinhDuongThua[0]} ,...</h4>
                </Tooltip>
              )}
              が多すぎね。
            </Box>
          )}

          {dinhDuongThieu.length > 0 && (
            <Box display="flex">
              ・{dinhDuongThieuMax}が足りないから{monAnNenAn}とか食べてみよ。
            </Box>
          )}
        </Box>
        <Box
          component="img"
          src="/static/illustrations/illustration_rocket.png"
          sx={{ width: 170, position: 'absolute', bottom: 15, left: 50 }}
        />
      </Box>
    </Card>
  );
}
