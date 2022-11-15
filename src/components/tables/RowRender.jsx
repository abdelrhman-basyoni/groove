
import { Table} from "antd";

const RowRender = ({data}) => {

  console.log('data',data)
 for(var i = 0; i < data.length; i++){
        console.log(data[i])
    }


    const columns = [
      {
        title: 'Amount',
        dataIndex: 'Amount',
        key: 'Amount',
      },
      {
        title: 'SettlementAccountDesc',
        dataIndex: 'SettlementAccountDesc',
        key: 'SettlementAccountDesc',
      },
     
    ];
  
  
     return <Table columns={columns} dataSource={data} pagination={false} />;
  }
 
export default RowRender;