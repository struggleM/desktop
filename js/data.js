/**
 * 数据
 *  id: 唯一的，标识每个数据的唯一的编号
 *  pid: 父级数据的id，通过id和pid可以把两个数据进行关联
 *  type: 文件类型
 *  name: 文件名称
 * @type {Array}
 */

var data = {
    menu: {
        'main': [
                    {
                        name: '新建',
                        disabled: false,
                        children: [
                            {
                                name: '文件夹',
                                callbackname: 'createFloder',
                            },
                            {
                             name: '文件'
                            }
                         ]
                     },
                    {
                        type: 'splitLine'
                    },
                    {
                        name: '上传文件',
                        disabled: false,
                        callbackname:'uploadFile'
                    },
                    {
                        type: 'splitLine'
                    },
                    {
                        name: '排序',
                        callbackname: 'sort',
                        children:[
                            {
                                name:'按名称排序',
                                callbackname:'nameSort'
                            },
                            {
                                name:'按时间排序',
                                callbackname:'timeSort'
                            }
                        ]
                    }
        ],
        'file': [
            {
                callbackname: 'createFloder',
                name: '新建'
            },
            {
                name: '复制',
                callbackname:'copyFloder'
            },
            {
                name: '删除',
                callbackname:'deleteFloder'
            }
        ]
    },
    list:[
        {
            id: 1,
            pid: 0,
            type: 'floder',
            name: '技术',
            time:3525
        },
        {
            id: 2,
            pid: 0,
            type: 'floder',
            name: '电影',
            time:352
        },
        {
            id: 3,
            pid: 0,
            type: 'floder',
            name: '音乐',
            time:35252222
        },
        {
            id:12,
            pid:3,
            type:'floder',
            name:'真的爱你',
            time:341414

        },
        {
            id: 4,
            pid: 0,
            type: 'floder',
            name: '图片',
            time:35252222222
        },
        {
            id: 5,
            pid: 0,
            type: 'floder',
            name: '小说',
            time:352522222333
        },
        {
            id: 6,
            pid: 0,
            type: 'floder',
            name: 'README',
            time:35251111
        },
        {
            id: 7,
            pid: 1,
            type: 'floder',
            name: '前端',
            time:3525999999
        },
        {
            id: 8,
            pid: 1,
            type: 'floder',
            name: '后端',
            time:352599999
        },
        {
            id: 9,
            pid: 7,
            type: 'floder',
            name: 'javascript'
        },
        {
            id: 10,
            pid: 9,
            type: 'floder',
            name: 'ECMAScript',
            time:35252662262
        },
        {
            id: 11,
            pid: 10,
            type: 'floder',
            name: 'ECMAScript2015',
            time:35259393939
        }
    ],
    trash:[],
    trashMenu:[
        {
            name:'还原',
            callbackname:'huanyuan'
        }
    ]
};
