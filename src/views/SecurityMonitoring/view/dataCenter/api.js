// import {get,post} from './index.js'
import {
  encrypt,
  decrypt
} from './aes'
import request from './index.js'

export const sql = async (s) => {
  const payload = {
    type: 'bulk',
    args: [{
      type: 'run_sql',
      args: {
        read_only: false,
        cascade: false,
        sql: s
      }
    }]
  }
  const formData = new FormData()
  formData.append('body', encrypt(JSON.stringify(payload)))
  const {
    data
  } = await request({
    url: '/h5/api/Hasura/query',
    method: 'POST',
    data: formData,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
  try {
    const e = data.data
    if (decrypt(e) === '') {
      return []
    }
    const list = JSON.parse(decrypt(e))
    if (list.length) {
      const [{
        result
      }] = list
      return result
    }
    return []
  } catch (e) {
    throw new Error(e)
  }
}

// 服务器 sql 设备数量 异常数量 告警数量
export const SqlTextService = [`select count(tch.id)
from t_cmdb_host tch 
left join t_model_host tmh on tch.host_type = tmh.host_type
where tmh.type_dict_value_code = 'Host'
and tch.enable = true;`, `select count(table1.host_id) from 
(
    select  host_id from t_alarm where state= 0 and host_id in (select tch.id
    from t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Host'
    and tch.enable = true
) group by host_id) as table1;`, `select  count(1) from 
t_alarm 
where state= 0 
and host_id in 
(
    select tch.id from 
    t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Host' 
    and tch.enable = true
);`]

export const SqlTextJhj = [`select count(tch.id)
from t_cmdb_host tch 
left join t_model_host tmh on tch.host_type = tmh.host_type
where tmh.host_type_dict_value_code in
(
    select value_code from t_dict_value where value_code like '%Switch%' or dict_code like '%switch%'
)
and tch.enable = true;`, `select count(table1.host_id) from 
(
    select  host_id from t_alarm where state= 0 and host_id in (select tch.id
    from t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code in
    (
        select value_code from t_dict_value where value_code like '%Switch%' or dict_code like '%switch%'
    )
    and tch.enable = true
) group by host_id) as table1;`, `select  count(1) from 
t_alarm 
where state= 0 
and host_id in 
(
    select tch.id from 
    t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code in
    (
        select value_code from t_dict_value where value_code like '%Switch%' or dict_code like '%switch%'
    )
    and tch.enable = true
);
`]

export const SqlTextFireWare = [`select count(tch.id)
from t_cmdb_host tch 
left join t_model_host tmh on tch.host_type = tmh.host_type
where tmh.type_dict_value_code = 'Firewall'
and tch.enable = true;`, `select count(table1.host_id) from 
(
    select  host_id from t_alarm where state= 0 and host_id in (select tch.id
    from t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Firewall'
    and tch.enable = true
) group by host_id) as table1;`, `select  count(1) from 
t_alarm 
where state= 0 
and host_id in 
(
    select tch.id from 
    t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Firewall' 
    and tch.enable = true
);`]

export const SqlTextLyq = [`select count(tch.id)
from t_cmdb_host tch 
left join t_model_host tmh on tch.host_type = tmh.host_type
where tmh.host_type_dict_value_code in
(
    select value_code from t_dict_value where value_code like '%Router%' or dict_code like '%Router%'
)
and tch.enable = true;`, `select count(table1.host_id) from 
(
    select  host_id from t_alarm where state= 0 and host_id in (select tch.id
    from t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code in
    (
        select value_code from t_dict_value where value_code like '%Router%' or dict_code like '%Router%'
    )
    and tch.enable = true
) group by host_id) as table1;`, `select  count(1) from 
t_alarm 
where state= 0 
and host_id in 
(
    select tch.id from 
    t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code in
    (
        select value_code from t_dict_value where value_code like '%Router%' or dict_code like '%Router%'
    )
    and tch.enable = true
);`]
export const SqlTextDatabase = [`select count(tch.id)
from t_cmdb_host tch 
left join t_model_host tmh on tch.host_type = tmh.host_type
where tmh.type_dict_value_code = 'Database'
and tch.enable = true;`, `select count(table1.host_id) from 
(
    select  host_id from t_alarm where state= 0 and host_id in (select tch.id
    from t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Database'
    and tch.enable = true
) group by host_id) as table1;`, `select  count(1) from 
t_alarm 
where state= 0 
and host_id in 
(
    select tch.id from 
    t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Database' 
    and tch.enable = true
);`]
export const SqlTextMiddle = [`select count(tch.id)
from t_cmdb_host tch 
left join t_model_host tmh on tch.host_type = tmh.host_type
where tmh.type_dict_value_code = 'Middleware'
and tch.enable = true;`, `select count(table1.host_id) from 
(
    select  host_id from t_alarm where state= 0 and host_id in (select tch.id
    from t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Middleware'
    and tch.enable = true
) group by host_id) as table1;`, `select  count(1) from 
t_alarm 
where state= 0 
and host_id in 
(
    select tch.id from 
    t_cmdb_host tch 
    left join t_model_host tmh on tch.host_type = tmh.host_type
    where tmh.type_dict_value_code = 'Middleware' 
    and tch.enable = true
);`]

// 巡更 次数/ 发现问题数

export const SqlTextXg = [{
  title: '当日巡更次数',
  sql: `select 
concat_ws('/',(select count(1) from t_patrol_task_status 
where to_date(create_time::text, 'yyyy-mm-dd') = current_date
and status in ('10','20')),(select count(1) from t_patrol_task_status 
where to_date(create_time::text, 'yyyy-mm-dd') = current_date)) as metric_value;`
}, {
  title: '当日巡更问题数',
  sql: `select count(1) as value
from t_patrol_task_event_history 
where task_id in (
    select id from t_patrol_task_status 
    where to_date(create_time::text, 'yyyy-mm-dd') = current_date
    and status in ('10','20')  
);`
}]

export const title_option = {
  backgroundColor: '#edeff2',
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false
  },
  series: [{
    name: '设备种类',
    type: 'pie',
    radius: ['30%', '65%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    hoverAnimation: true,
    label: {
      normal: {
        fontSize: '80%',
        color: '#000',
        align: 'left',
        formatter: function (params) {
          var label = `${params.name} \n${params.value}`
          return label
        }
      }
    },
    labelLine: {
      normal: {
        show: false,
        length: 18,
        length2: 0
      }
    },
    itemStyle: {
      normal: {
        borderWidth: 4, // 设置border的宽度有多大
        borderColor: '#edeff2'
      }
    },
    emphasis: {
      label: {
        show: true,
        fontSize: '80%'
        // fontWeight: 'bold'
      }
    },
    data: [{
      value: 243,
      name: '防火墙',
      itemStyle: {
        normal: {
          color: '#FFA044'
        },
        emphasis: {
          color: '#FFA044'
        }
      }
    }, {
      value: 43,
      name: '服务器',
      itemStyle: {
        normal: {
          color: '#3CA6FF'
        },
        emphasis: {
          color: '#3CA6FF'
        }
      }
    },
    {
      value: 36,
      name: '交换机',
      itemStyle: {
        normal: {
          color: '#EAE174'
        },
        emphasis: {
          color: '#EAE174'
        }
      }
    }, {
      value: 98,
      name: '中间件',
      itemStyle: {
        normal: {
          color: '#DC5656'
        },
        emphasis: {
          color: '#DC5656'
        }
      }
    }, {
      value: 212,
      name: '数据库',
      itemStyle: {
        normal: {
          color: '#1BBF90'
        },
        emphasis: {
          color: '#1BBF90'
        }
      }
    }, {
      value: 243,
      name: '路由器',
      itemStyle: {
        normal: {
          color: '#BF78C6'
        },
        emphasis: {
          color: '#BF78C6'
        }
      }
    }
    ]
  }]
}

export const status_option = {
  backgroundColor: '#edeff2',
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false,
    top: '5%',
    left: 'center'
  },
  series: [{
    name: '告警数量',
    type: 'pie',
    radius: ['30%', '65%'],
    center: ['50%', '50%'],
    hoverAnimation: true,
    label: {
      normal: {
        fontSize: '80%',
        color: '#000',
        align: 'left',
        formatter: function (params) {
          var label = `${params.name} \n${params.value}`
          return label
        }
      }

    },
    labelLine: {
      normal: {
        show: false,
        length: 18,
        length2: 0
      }
    },
    itemStyle: {
      normal: {
        borderWidth: 4, // 设置border的宽度有多大
        borderColor: '#edeff2'
      }
    },
    emphasis: {
      label: {
        show: true,
        fontSize: '80%'
        // fontWeight: 'bold',
      }
    },
    data: [{
      value: 145,
      name: '一般',
      itemStyle: {
        normal: {
          color: '#3CA6FF'
        },
        emphasis: {
          color: '#3CA6FF'
        }
      }
    }, {
      value: 478,
      name: '主要',
      itemStyle: {
        normal: {
          color: '#FFA044'
        },
        emphasis: {
          color: '#FFA044'
        }
      }
    },
    {
      value: 736,
      name: '次要',
      itemStyle: {
        normal: {
          color: '#EAE174'
        },
        emphasis: {
          color: '#EAE174'
        }
      }
    },

    // {
    // 	value: 212,
    // 	name: '正常',
    // 	itemStyle: {
    // normal:{
    // 		color: '#1BBF90'
    // }
    // 	}
    // },
    {
      value: 184,
      name: '紧急',
      itemStyle: {
        normal: {
          color: '#DC5656'
        },
        emphasis: {
          color: '#DC5656'
        }
      }
    }
    ]
  }]
}
