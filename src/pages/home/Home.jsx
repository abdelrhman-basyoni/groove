
// import './home.scss'
import React, { useState, useEffect } from 'react'
import { Button,Modal, Popconfirm, Tooltip } from 'antd';
import DataTable from "../../components/tables/Table";
import { useNavigate } from 'react-router-dom'
import { getCampaigns,deleteCampaign } from '../../api'
import AddCmapgainModal from './AddCmapgainModal';
const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [ModalOpened, setModalOpened] = useState(false);
  const  navigate = useNavigate()
  const columns =
    [
      {
        title: "id",
        dataIndex: 'id',
        // key: 'service',
        width: 3,
        fixed: "left",
      },
      {
        title: "name",
        dataIndex: 'name',
        // key: 'service',
        width: 3,

      },
      {
        title: "objective",
        dataIndex: 'objective',
        // key: 'service',
        width: 3,

      },
      {
        title: 'select',
        dataIndex: 'select',
        width: 3,
        render: (_, record) => {
          return (
    
              <Button onClick={ e => { e.preventDefault();navigate(`/campgains/${record.id}`)}} className="accept-btn" size="large" type="dashed">
                {'select'}
              </Button>
         
          );
        }
      },
      // {
      //   title: 'delete',
      //   dataIndex: 'delete',
      //   width: 3,
      //   render: (_, record) => {
      //     return (
      //       <Popconfirm
      //         title={'confirm_delete'}
      //         onConfirm={(key) => deleteCampaign(record.id)}
      //         okText={'yes'}
      //         cancelText={'no'}>
      //         <Tooltip title={'delete'}>
      //           <Button className="accept-btn" size="large" type="dashed">
      //             {'delete'}
      //           </Button>
      //         </Tooltip>
           
      //       </Popconfirm>
      //     );
      //   }
      // }
    ]
  const fetchData = async () => {
    const data = await getCampaigns()
    console.log({ data })
    if (data) {
      setCampaigns(data.data)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const formatedData = campaigns.map(campaign =>{
    return {
      ...campaign,
      key:campaign.id
    }
  })
  return (
    <div>
      <div>
      <button onClick={e  =>{ e.preventDefault(); setModalOpened(true)}} type="button" class="btn btn-dark px-5 radius-30">Add Campgain</button>
      </div>
      {
        ModalOpened?

        <Modal
        className="add-User-modal"
        width="90%"
        style={{ maxWidth: '900px' }}
        title={'New Campgain'}
        visible={ModalOpened}
        onOk={() => {
          setModalOpened(false);

        }}
        onCancel={() => {
          setModalOpened(false);

        }}
        footer={false}>
          <AddCmapgainModal
          setModalOpened={setModalOpened}
          fetchData={fetchData}
           />
   
      </Modal>
        : null
      }

      <DataTable columns={columns} data={formatedData} />
    </div>
  );
}

export default Home;