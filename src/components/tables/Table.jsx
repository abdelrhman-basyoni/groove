import { Table} from "antd";
import RowRender from "./RowRender";

const DataTable = ({columns,data}) => {
  console.log("column" ,columns)
    return (  
         <Table
        pagination={{
          pageSize: 25,
          total: data.length,
          // onChange: (pageNumber, pageSize) => { setResponseData({}); setPage(pageNumber) },
          // current:{page}
        }}
        className="CompletedRequests-table"
        dataSource={data}
        scroll={{
          X: 1500,
          y: 500,
        }}
        columns={
          columns
        }   
        // expandable={{
            //     expandedRowRender,
            //     defaultExpandedRowKeys: ['0'],
            //   }}
            // loading={orders ? false : true}
            // scroll={{ x: 1200 }}
           />
    );
}
 
export default DataTable;