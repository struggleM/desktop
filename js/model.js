/**
 * 获取指定id的数据信息
 * @param id 要查找的id
 * @return {Object} 满足条件的数据
 */
function getInfo(id) {
    return data.list.filter(function (item) {
        return item.id == id
    })[0];
}
/**
 * 根据指定的id，返回其下的所有一级子数据
 * @param id 要查找的id
 * @returns {Array} 包含一级子数据的数组
 */
function getChildren(id) {
    return data.list.filter(function (item) {
        return item.pid == id
    });
}

function getTrashChildren(id) {
    return data.trash.filter(function (item) {
        return item.pid == id
    });
}
function getParent(id) {
    // 得到当前数据
    var info = getInfo(id);
    if (info) {
        // 根据自己的pid获取父级的info
        return getInfo(info.pid);
    }
}
/**
 * 获取指定id的所有父级（不包括自己）
 * @param id
 * @return {Array} 返回一个包含所有父级数据的数组
 */
function getParents(id) {
    // 保存所有父级数据
    var parents = [];

    // 获取父级
    var parentInfo = getParent(id);
    // 如果父级信息存在
    if (parentInfo) {
        // 把当前父级的信息保存到parents里面
        parents.push(parentInfo);
        var more = getParents(parentInfo.id);
        parents = more.concat(parents);
    }
    return parents;
}
/**
 * 添加新数据
 * @param newData
 */
function addData(newData) {
    newData.id = getMaxId() + 1;
    var existFiles = checkName(newData);
    // console.log(existFiles)
    if (existFiles.length) {
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
        for (var i = 1; i <= existFiles.length; i++) {
            var v = existFiles.find(function(ele) {
                return ele.extname == i;
            });
            if (v === undefined) {
                newData.extname = i;
                break;
            }
        }
    }
    data.list.push(newData);
    view(_ID);
}
//检测重名的
function checkName(newData) {
    var arr = [];
    data.list.forEach(function (item) {
        if(item.type == newData.type&&item.name==newData.name){
            arr.push(item)
        }
    });
    return arr;
}
/*
* 获取数据中最大的id
* */
function getMaxId() {
    var maxid = 0;
    data.list.forEach(function (item) {
        if (item.id > maxid) {
            maxid = item.id;
        }
    });
    return maxid;
}
//根据指定的id获取对应的pid所对应的数据
function getchilds(id) {
    return getChildernChild(id);
}
//垃圾桶
function getTrashChildernChild(id) {
    return getTrashChildernChild(id);
}
//根据当前的id查看下面还有没有数据
function getChildernChild(id) {
    var childInfo = getChildval(id);
    var childs = [];
    childInfo.forEach(function (item) {
        // 如果子级信息存在
        if (item) {
            // 把当前子级的信息保存到parents里面
            childs.push(item);
            var more = getChildernChild(item.id);
            childs = more.concat(childs);
        }
    });
    return childs;
}
//根据当前的id查看下面还有没有数据垃圾桶
function getTrashChildernChild(id) {
    var childInfo = getTrashChildval(id);
    var childs = [];
    childInfo.forEach(function (item) {
        // 如果子级信息存在
        if (item) {
            // 把当前子级的信息保存到parents里面
            childs.push(item);
            var more = getTrashChildernChild(item.id);
            childs = more.concat(childs);
        }
    });
    return childs;
}
//再通过对应的数据所对应的id获取对应的数据
function getChildval(id) {
    var arr = [];
    arr = data.list.filter(function (item) {
        if(item.pid == id){
            return true;
        }
        return false;
    });
    return arr;
}
//垃圾桶里面的筛选
function getTrashChildval(id) {
    var arr = [];
    arr = data.trash.filter(function (item) {
        if(item.pid == id){
            return true;
        }
        return false;
    });
    return arr;
}
/*粘贴的一个函数
 函数返回当前父级复制出来的所有子级，并改掉所有的id和pid
 liArr 是父级的信息
 info 是父级的所有子级
*/

function stickFloder(StickArr) {
    var Stick = StickArr;
    Stick.pid = liArr[0].id;
    var info = getchilds(Stick.id);
    info.unshift(Stick);

    var arr = [];
    info.forEach(function (item) {
        arr.push(deepCopy(item));
    });
    getStickArr(arr);
}
//返回修改了id和pid的数组
function getStickArr(info) {
    info.forEach(function (item) {
        item.lastId = item.id;
    });
    var num = getMaxId();
    info.forEach(function (item) {
        item.id = num++;
    });
    var arr = [];
    info.forEach(function (item) {
        arr.push(deepCopy(item));
    });

    for(var i=0;i<info.length;i++){
        for(var j=0;j<arr.length;j++){
            if(info[i].pid == arr[j].lastId){
                info[i].pid = arr[j].id;
            }
        }
    }
    info.forEach(function (item) {
       data.list.push(item);
    });
    view(_ID)
    
}
//深拷贝对象
function deepCopy(p, c) {
    var c = c || {};
    for (var i in p) {
        if (typeof p[i] === 'object') {
            c[i] = (p[i].constructor === Array) ? [] : {};
            deepCopy(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
    return c;
}









