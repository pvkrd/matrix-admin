const fs = require('fs');
const newData = {
  _id: null,
  staffResourceIds: [
    {
      $numberLong: '150',
    },
    {
      $numberLong: '526',
    },
    {
      $numberLong: '1279',
    },
    {
      $numberLong: '1354',
    },
    {
      $numberLong: '1398',
    },
    {
      $numberLong: '1640',
    },
    {
      $numberLong: '2123',
    },
    {
      $numberLong: '2200',
    },
    {
      $numberLong: '2730',
    },
    {
      $numberLong: '3060',
    },
    {
      $numberLong: '3412',
    },
    {
      $numberLong: '3979',
    },
    {
      $numberLong: '4575',
    },
    {
      $numberLong: '4715',
    },
    {
      $numberLong: '4784',
    },
    {
      $numberLong: '5654',
    },
    {
      $numberLong: '5913',
    },
    {
      $numberLong: '6010',
    },
    {
      $numberLong: '6154',
    },
    {
      $numberLong: '6390',
    },
    {
      $numberLong: '6722',
    },
    {
      $numberLong: '6876',
    },
    {
      $numberLong: '7182',
    },
    {
      $numberLong: '7416',
    },
    {
      $numberLong: '7686',
    },
    {
      $numberLong: '7888',
    },
    {
      $numberLong: '8847',
    },
    {
      $numberLong: '9001',
    },
    {
      $numberLong: '9788',
    },
    {
      $numberLong: '9800',
    },
    {
      $numberLong: '10923',
    },
    {
      $numberLong: '100158',
    },
    {
      $numberLong: '100935',
    },
    {
      $numberLong: '101791',
    },
    {
      $numberLong: '102481',
    },
    {
      $numberLong: '102856',
    },
    {
      $numberLong: '104687',
    },
    {
      $numberLong: '105517',
    },
    {
      $numberLong: '109284',
    },
    {
      $numberLong: '111118',
    },
    {
      $numberLong: '111836',
    },
    {
      $numberLong: '112011',
    },
    {
      $numberLong: '112359',
    },
    {
      $numberLong: '113123',
    },
    {
      $numberLong: '113433',
    },
    {
      $numberLong: '114021',
    },
    {
      $numberLong: '114054',
    },
    {
      $numberLong: '114066',
    },
    {
      $numberLong: '114071',
    },
    {
      $numberLong: '114128',
    },
    {
      $numberLong: '114150',
    },
    {
      $numberLong: '114153',
    },
    {
      $numberLong: '114180',
    },
    {
      $numberLong: '114188',
    },
    {
      $numberLong: '114225',
    },
    {
      $numberLong: '114236',
    },
    {
      $numberLong: '114245',
    },
    {
      $numberLong: '114277',
    },
    {
      $numberLong: '114298',
    },
    {
      $numberLong: '114323',
    },
    {
      $numberLong: '114373',
    },
    {
      $numberLong: '114485',
    },
    {
      $numberLong: '114493',
    },
    {
      $numberLong: '114494',
    },
    {
      $numberLong: '114506',
    },
    {
      $numberLong: '114547',
    },
    {
      $numberLong: '114552',
    },
    {
      $numberLong: '114595',
    },
    {
      $numberLong: '114611',
    },
    {
      $numberLong: '114633',
    },
    {
      $numberLong: '114641',
    },
    {
      $numberLong: '114653',
    },
    {
      $numberLong: '114684',
    },
    {
      $numberLong: '114695',
    },
    {
      $numberLong: '114841',
    },
    {
      $numberLong: '114843',
    },
    {
      $numberLong: '114875',
    },
    {
      $numberLong: '114876',
    },
    {
      $numberLong: '114925',
    },
    {
      $numberLong: '115002',
    },
    {
      $numberLong: '115004',
    },
    {
      $numberLong: '115026',
    },
    {
      $numberLong: '115089',
    },
    {
      $numberLong: '115100',
    },
    {
      $numberLong: '115108',
    },
    {
      $numberLong: '115152',
    },
    {
      $numberLong: '115156',
    },
    {
      $numberLong: '115174',
    },
    {
      $numberLong: '115229',
    },
    {
      $numberLong: '115243',
    },
    {
      $numberLong: '115244',
    },
    {
      $numberLong: '115253',
    },
    {
      $numberLong: '115254',
    },
    {
      $numberLong: '115259',
    },
    {
      $numberLong: '115260',
    },
    {
      $numberLong: '115266',
    },
    {
      $numberLong: '115267',
    },
    {
      $numberLong: '115322',
    },
    {
      $numberLong: '115328',
    },
    {
      $numberLong: '115347',
    },
    {
      $numberLong: '115348',
    },
    {
      $numberLong: '115357',
    },
    {
      $numberLong: '115384',
    },
    {
      $numberLong: '115385',
    },
    {
      $numberLong: '115402',
    },
    {
      $numberLong: '115408',
    },
    {
      $numberLong: '115456',
    },
    {
      $numberLong: '115463',
    },
    {
      $numberLong: '115488',
    },
    {
      $numberLong: '115497',
    },
    {
      $numberLong: '115502',
    },
    {
      $numberLong: '115527',
    },
    {
      $numberLong: '115541',
    },
    {
      $numberLong: '115544',
    },
    {
      $numberLong: '115554',
    },
    {
      $numberLong: '115562',
    },
    {
      $numberLong: '115626',
    },
    {
      $numberLong: '115641',
    },
    {
      $numberLong: '115642',
    },
    {
      $numberLong: '115648',
    },
    {
      $numberLong: '115668',
    },
    {
      $numberLong: '115764',
    },
    {
      $numberLong: '115767',
    },
    {
      $numberLong: '115769',
    },
    {
      $numberLong: '115771',
    },
    {
      $numberLong: '115774',
    },
    {
      $numberLong: '115789',
    },
    {
      $numberLong: '115800',
    },
    {
      $numberLong: '115804',
    },
    {
      $numberLong: '115816',
    },
    {
      $numberLong: '115827',
    },
    {
      $numberLong: '115828',
    },
    {
      $numberLong: '115868',
    },
    {
      $numberLong: '115878',
    },
    {
      $numberLong: '115881',
    },
    {
      $numberLong: '115907',
    },
    {
      $numberLong: '115936',
    },
    {
      $numberLong: '115942',
    },
    {
      $numberLong: '115944',
    },
    {
      $numberLong: '115958',
    },
    {
      $numberLong: '115962',
    },
    {
      $numberLong: '115964',
    },
    {
      $numberLong: '115992',
    },
    {
      $numberLong: '116002',
    },
    {
      $numberLong: '116007',
    },
    {
      $numberLong: '116049',
    },
    {
      $numberLong: '116123',
    },
    {
      $numberLong: '116131',
    },
    {
      $numberLong: '116141',
    },
    {
      $numberLong: '116144',
    },
    {
      $numberLong: '116147',
    },
    {
      $numberLong: '116168',
    },
    {
      $numberLong: '116179',
    },
    {
      $numberLong: '116180',
    },
    {
      $numberLong: '116190',
    },
    {
      $numberLong: '116209',
    },
    {
      $numberLong: '116218',
    },
    {
      $numberLong: '116224',
    },
    {
      $numberLong: '116231',
    },
    {
      $numberLong: '116301',
    },
    {
      $numberLong: '116302',
    },
    {
      $numberLong: '116310',
    },
    {
      $numberLong: '116317',
    },
    {
      $numberLong: '116345',
    },
    {
      $numberLong: '116391',
    },
    {
      $numberLong: '116401',
    },
    {
      $numberLong: '116426',
    },
    {
      $numberLong: '116434',
    },
    {
      $numberLong: '116519',
    },
    {
      $numberLong: '116531',
    },
    {
      $numberLong: '116539',
    },
    {
      $numberLong: '116544',
    },
    {
      $numberLong: '116714',
    },
  ],
};

// Read the file
const filePath =
  '/Users/apple/Downloads/AvailableSlotsUpdate_2024-01-20T21-45-32.json';
const filePathout =
  '/Users/apple/Documents/azure/AvailableSlotsUpdate_2024-01-17T00-12-09_test_PIT.json';
const fileContent = fs.readFileSync(filePath, 'utf8');
let convertedData = newData.staffResourceIds.map(item => Number(item.$numberLong));
// Parse the file content to a JavaScript object
const data = JSON.parse(fileContent);

// Replace the staffResourceId with newData.staffResourceIds
data.forEach((item, index) => {
  if (!convertedData.includes(item.staffResourceId)) {
    console.log(`staffResourceId ${item.staffResourceId} not found in newData`);
    //return;
  }
  
 // console.log(item.staffResourceId);
});
