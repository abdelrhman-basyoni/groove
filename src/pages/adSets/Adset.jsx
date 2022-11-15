
// import './home.scss'
import React, { useState, useEffect } from 'react'
import { Button,Modal, Popconfirm, Tooltip } from 'antd';
import DataTable from "../../components/tables/Table";
import { useNavigate } from 'react-router-dom'
import { getCampaignsAdSets, convertRate } from '../../api'
import { useParams } from 'react-router';
import AdAdsetModal from './AdAdsetModal'
import moment from 'moment'
const Adset = () => {
  const { campgainId: campgainId } = useParams()
  const [ModalOpened, setModalOpened] = useState(false);
  console.log({ campgainId })
  const [adsets, setAdSets] = useState([])
  const navigate = useNavigate()
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
        title: "start_time",
        dataIndex: 'start_time',
        // key: 'service',
        width: 3,

      },
      {
        title: "end_time",
        dataIndex: 'end_time',
        // key: 'service',
        width: 3,

      },
      {
        title: "daily_budget",
        dataIndex: 'daily_budget',
        // key: 'service',
        width: 3,

      },
      {
        title: "lifetime_budget",
        dataIndex: 'lifetime_budget',
        // key: 'service',
        width: 3,

      },
      {
        title: 'select',
        dataIndex: 'select',
        width: 3,
        render: (_, record) => {
          return (

            <Button onClick={e => { e.preventDefault(); navigate(`/adsets/${record.id}`) }} className="accept-btn" size="large" type="dashed">
              {'select'}
            </Button>

          );
        }
      }
    ]
  const fetchData = async () => {
    const data = await getCampaignsAdSets(campgainId)

    if (data) {
      setAdSets(data.data)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const formatedData = adsets.map(campaign => {
    console.log({daily_budget:campaign.daily_budget})
    return {
      ...campaign,
      key: campaign.id,
      daily_budget:campaign.daily_budget / convertRate / 100 || '--' ,
      start_time: moment(campaign.start_time).format('MMMM Do YYYY, h:mm a'),
      end_time:campaign?.end_time ? moment(campaign.end_time).format('MMMM Do YYYY, h:mm a') : '--'
    }
  })
  return (
    <div>
      <div>
        <button onClick={e => { e.preventDefault(); setModalOpened(true) }} type="button" class="btn btn-dark px-5 radius-30">New Adset</button>
      </div>
      {
        ModalOpened?
        <Modal
        className="add-User-modal"
        width="90%"
        style={{ maxWidth: '900px' }}
        title={'New Adset'}
        visible={ModalOpened}
        onOk={() => {
          setModalOpened(false);
          // setSelectedServId('');
          // setSelected(null);
        }}
        onCancel={() => {
          setModalOpened(false);
          // setSelectedServId('');
          // setSelected(null);
        }}
        footer={false}>
          <AdAdsetModal
          setModalOpened={setModalOpened}
          fetchData={fetchData}
          campgainId={campgainId}
           />

      </Modal>

        :null
      }
  
      <DataTable columns={columns} data={formatedData} />
    </div>
  );
}

export default Adset;