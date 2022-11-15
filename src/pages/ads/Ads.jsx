
// import './home.scss'
import React, { useState, useEffect } from 'react'
import { Button, Popconfirm, Tooltip } from 'antd';
import DataTable from "../../components/tables/Table";
import { useNavigate } from 'react-router-dom'
import { getAdSetsAds } from '../../api'
import { useParams } from 'react-router';
const Ads = () => {
    const { adsetsId: adsetsId } = useParams()
    console.log({adsetsId})
  const [ads, setAds] = useState([])
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
        title: "configured_status",
        dataIndex: 'configured_status',
        // key: 'service',
        width: 3,

      },
      {
        title: "effective_status",
        dataIndex: 'effective_status',
        // key: 'service',
        width: 3,

      },


      {
        title: 'select',
        dataIndex: 'select',
        width: 3,
        render: (_, record) => {
          return (
    
              <Button onClick={ e => { e.preventDefault();navigate(`/${record.id}/adsets`)}} className="accept-btn" size="large" type="dashed">
                {'select'}
              </Button>
         
          );
        }
      }
    ]
  const fetchData = async () => {
    const data = await getAdSetsAds(adsetsId)
    console.log({data})
    if (data) {
      setAds(data.data)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const formatedData = ads.map(campaign =>{
    return {
      ...campaign,
      key:campaign.id
    }
  })
  return (
    <div>
      <DataTable columns={columns} data={formatedData} />
    </div>
  );
}

export default Ads;