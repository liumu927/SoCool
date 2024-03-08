// 格式化 订单信息
export const formatOrderInfo = (data) => {
    const { name, info } = data;
    let orderDetail = [];

    if (name === '快递代取') {
        const tempObj = {
            business: "快递商家",
            expectGender: "性别限制",
            expectTime: "期望送达",
            expressCode: "取件码",
            number: "快递数量",
            remark: "备注",
            size: "快递类型"
        };
        for (let i in info) {
            if (info[i]) {
                orderDetail.push({
                    key: tempObj[i],
                    value: info[i]
                })
            }
        }
    } else if (name === "打印服务") {
        const tempObj = {
            pageNum: "页数",
            colorPrint: "是否彩印",
            twoSided: "是否双面",
            remark: "备注"
        };
        for (let i in info) {
            if (tempObj[i]) {
                orderDetail.push({
                    key: tempObj[i],
                    value: typeof info[i] === 'boolean' ? (info[i] ? '是' : '否') : info[i]
                })
            }
        }
    } else if (name === "校园跑腿") {
        const tempObj = {
            helpContent: "帮助内容",
            pickUpAddress: "取货地点",
        };
        for (let i in info) {
            orderDetail.push({
                key: tempObj[i],
                value: info[i]
            })
        }
    } else if (name === "快递代寄") {
        const tempObj = {
            helpContent: "帮助内容",
            business: "快递商家",
            remark: "备注"
        };
        for (let i in info) {
            orderDetail.push({
                key: tempObj[i],
                value: info[i]
            })
        }
    } else if (name === "租借服务") {
        const tempObj = {
            leaseItem: "租借物品",
            leaseTime: "租借时长",
            deliveryTime: "预计交货时间"
        };
        for (let i in info) {
            orderDetail.push({
                key: tempObj[i],
                value: info[i]
            })
        }
    } else if (name === "游戏陪玩") {
        const tempObj = {
            gameName: "游戏名称",
            gameTime: "游戏时间or盘数",
            gameID: "游戏ID",
            remark: "备注信息"
        };
        for (let i in info) {
            orderDetail.push({
                key: tempObj[i],
                value: info[i]
            })
        }
    } else if (name === "帮我送") {
        const tempObj = {
            deliveryInfo: "送达地点",
        };
        for (let i in info) {
            orderDetail.push({
                key: tempObj[i],
                value: info[i]
            })
        }
    } else if (name === "结伴服务") {
        const tempObj = {
            helpContent: "帮助内容",
        };
        for (let i in info) {
            orderDetail.push({
                key: tempObj[i],
                value: info[i]
            })
        }
    } else if (name === "其他帮助") {
        const tempObj = {
            helpContent: "帮助内容",
        };
        for (let i in info) {
            orderDetail.push({
                key: tempObj[i],
                value: info[i]
            })
        }
    }

    return orderDetail;
}


export const getTimeNow = () => {
    let dateTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    let hh = new Date().getHours()
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
        new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
        new Date().getSeconds()
    dateTime = `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`;
    return dateTime
}