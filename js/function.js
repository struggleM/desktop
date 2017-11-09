/**
 * 渲染页面文件列表
 * @param pid 要渲染的文件数据的pid
 */
function view(pid,data) {
    // 只要调用了view方法，那么我们就把_ID设置成我们要view的pid
    //记录_ID的值，以便其他的地方去使用，记录当view过后，当前所在的目录的id
    _ID = pid;
    var dataList;
    if(data){
        if(_ID!=0||_ID==1){
            dataList = getTrashChildren(_ID);
        }else{
            dataList = data;
        }
    }else{
        dataList = getChildren(_ID);
    }
    elements.list.innerHTML = '';
    // var dataList = data?data:dataList;
    // 文件列表
    dataList.forEach(function (item) {
        var li = document.createElement('li');
        var offset = getfileOffset();
        li.style.left = offset.x+'px';
        li.style.top = offset.y+'px';
        li.index = item.id;
        li.pid = item.pid;
        li.type = item.type;
        li.className = item.type;
        li.item = item;
        if(data){
            li.dataset.ip = 1;
        }
        if(item.extname){
            var str = item.name+'('+item.extname+')';
            li.innerHTML = '<span>'+str+'</span><input type="text">';
        }else{
            li.innerHTML = `<span>${item.name}</span><input type="text">`;
        }
        if(item.type == 'floder'){
            setEvent(li,item);
        }

        elements.list.appendChild(li);
    });
    /*
    * 给创建出来的li添加事件
    *
    * */
    //框选
    (function () {
        document.addEventListener('mousedown',function (e) {
            if(e.button == 2){
                return;
            }
            elements.contextmenu.style.display = 'none';
            elements.elementMenu.style.display = 'none';
            e.stopPropagation();
            // e.preventDefault();
            var div = document.createElement('div');
            var list = document.querySelector('#list');
            var lis = list.querySelectorAll('li');
            div.className = 'select';
            var start = {
                x:e.clientX,
                y:e.clientY
            };
            div.style.left = e.clientX+'px';
            div.style.top = e.clientY +'px';
            document.body.appendChild(div);
            document.addEventListener('mousemove',move);
            document.addEventListener('mouseup',end);
            function move(e) {
                var nowS = {
                    x:e.clientX,
                    y:e.clientY
                };
                div.style.width = Math.abs(nowS.x - start.x)+'px';
                div.style.height = Math.abs(nowS.y - start.y)+'px';
                if (nowS.x < start.x) {
                    div.style.left = nowS.x + "px";
                } else {
                    div.style.left = start.x + "px";
                }
                if (nowS.y < start.y) {
                    div.style.top = nowS.y + "px";
                } else {
                    div.style.top = start.y + "px";
                }
                for(var i=0;i<lis.length;i++){
                    if(getCollide(lis[i],div)){
                        lis[i].classList.add("active");
                        lis[i].children[0].style.color = '#fff';
                    }else{
                        lis[i].classList.remove('active');
                        lis[i].classList.remove('hover');
                        lis[i].children[0].style.color = '#000';
                    }
                }
            }
            function end() {
                document.removeEventListener('mousemove',move);
                document.removeEventListener('mouseup',end);
                document.body.removeChild(div);
            }
        })
    })();
    // 导航列表
    // 由三个部分组成：顶层 + 所有父级 + 当前目录
    var pathList = getParents(_ID);
    elements.crumbs.innerHTML = '';

    // 顶级
    var li = document.createElement('li');
    li.innerHTML = '<a href="javascript:;">/</a>';
    li.onclick = function() {
        view(0);
    };
    elements.crumbs.appendChild(li);

    pathList.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = `<span> &gt; </span><a href="javascript:;">${item.name}</a>`;
        li.onclick = function() {
            view(item.id);
        };
        elements.crumbs.appendChild(li);
    });

    // 当前所在目录
    var info = getInfo(_ID);
    if (info) {
        var li = document.createElement('li');
        li.innerHTML = `<span> &gt; </span><span>${info.name}</span>`;
        elements.crumbs.appendChild(li);
    }

}
//碰撞检测函数
function getCollide(el, el2) {
    var rect = el.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();
    if (rect.right < rect2.left || rect.left > rect2.right || rect.bottom < rect2.top || rect.top > rect2.bottom) {
        return false;
    }
    return true;
}
function hideMenu() {
    elements.elementMenu.style.display = 'none';
    elements.contextmenu.style.display = 'none';
}

var callBackContextmenu = {
    //添加文件夹
    createFloder:function (target) {
        var fileName = '新建文件夹';
        addData({
            pid: _ID,
            type: 'floder',
            name:fileName,
            extname:0,
            time:Date.now()
        });
        view(_ID);
        hideMenu();
    },
    //删除
    deleteFloder:function (target) {
        arrParent.push(target.obj.item);
        var childs = getchilds(target.index);
        if(childs.length){
            arr1.push(childs);
        }
        console.log(childs)
        if(childs.length){
            childs.forEach(function (child) {
                data.list = data.list.filter(function (item) {
                    if(item.id == child.id||item.id == target.index){
                        return false;
                    }
                    return true;
                })
            });
        }else{
            data.list = data.list.filter(function (item) {
                if(item.id == target.index){
                    return false
                }
                return true;
            })
        }
        view(_ID);
        hideMenu();
    },
    //重命名
    renameFloder:function (target) {

        var span = target.obj.getElementsByTagName('span')[0];
        var input = target.obj.getElementsByTagName('input')[0];
        elements.elementMenu.style.display = 'none';
        elements.contextmenu.style.display = 'none';
        span.style.display = 'none';
        input.style.display = 'block';
        console.dir(span,input)

        input.value = span.innerHTML;
        input.focus();
    },
    //上传文件
    uploadFile:function (target) {
        file.click();
        hideMenu();
    },
    //按名称排序
    nameSort:function (target) {
        data.list.sort(function (a,b) {
            if (pinyin.getFullChars(a.name) > pinyin.getFullChars(b.name)) {
                return 1;
            }
            return -1;
        });
        view(_ID);
        resetOffset();
        elements.contextmenu.style.display = 'none';
    },
    //按时间排序
    timeSort:function () {
        data.list.sort(function (a,b) {
            return a.time - b.time;
        });
        view(_ID);
        elements.contextmenu.style.display = 'none';
    },
    //还原
    huanyuan:function (target) {
        var item = target.item;
        var itemChildren = getTrashChildernChild(item.id);
        arrParent = arrParent.filter(function (items) {
            if(items.id==item.id){
                return false
            }
            return true;
        });
        data.trash = data.trash.filter(function (items) {
            if(items.id==item.id){
                return false;
            }
            return true;
        });
        itemChildren.forEach(function (items) {
           data.trash =  data.trash.filter(function (val) {
                if(val.id == items.id){
                    return false
                }
                return true;
            })
        });
        view(_ID,data.trash);
        data.list.unshift(item);
        data.list = data.list.concat(itemChildren);
        elements.trashMenu.style.display = 'none';
    },
    //复制
    copyFloder:function (target) {
        var content = target.obj.item;
        data.menu.main.push({
            callbackname:'stickFloder',
            name:'粘贴'
        });
        StickArr.push({
            id:target.obj.index,
            pid:target.obj.pid,
            time:Date.now(),
            type:target.obj.type,
            name:content.name
        });
        view(_ID);
        hideMenu();
    },
    //粘贴
    stickFloder:function (target) {

        stickFloder(StickArr[0]);
        // StickArr[0].pid = liArr[liArr.length-1].id;
        // StickArr[0].id = getMaxId();
        // data.list.push(StickArr[0]);
        // view(_ID);
        // StickArr = [];
        hideMenu();
    }
};

/*
 getfileOffset 获取文件夹的位置
 [index]要获取第几个文件夹的位置
 */
function getfileOffset(index) {
    var list = document.querySelector('#list');
    var fileEls = list.querySelectorAll('li');
    index = (typeof(index) != "undefined") ? index : fileEls.length;
    // index  = data.list.length;
    // console.log(index)
    var filesW = css(trash, "width") + 5;
    var filesH = css(trash, "height") + 20;
    var ceils = Math.floor((list.clientHeight-120) / filesH); //一竖列可以放几个
    var x = Math.floor(index / ceils); //算出元素在第几列
    var y = index % ceils; //算出元素在第几行
    return {
        x: x * filesW,
        y: y * filesH
    };
}
/* 窗口改变修改文件夹位置 */
window.addEventListener('resize', resetOffset);
/* resetOffset 位置重新设置*/
function resetOffset() {
    var list = document.querySelector('#list');
    var fileEls = list.querySelectorAll('li');
    for (var i = 0; i < fileEls.length; i++) {
        var offset = getfileOffset(i);
        startMove({
            el: fileEls[i],
            target: {
                left: offset.x,
                top: offset.y
            },
            time: 500,
            type: "easeOut"
        });
    }
}
//渲染右键菜单
function  showContextmenu(target) {
    target.data.forEach( function(item) {
        var li = document.createElement('li');

        if (item.type && item.type == 'splitLine') {
            li.className = 'splitline';
        } else {
            li.innerHTML = item.name;

            if (item.disabled) {
                li.className = 'disabled';
            }
            // 子菜单
            li.addEventListener('mousedown',function (e) {
                e.stopPropagation();
                callBackContextmenu[item.callbackname](target);

            });

            li.onmouseover = function(e) {

                if (item.disabled) {
                    return;
                }

                var lis = this.parentNode.children;
                for (var i=0; i<lis.length; i++) {
                    if (lis[i].className != 'splitline' && lis[i].className != 'disabled') {
                        lis[i].className = '';
                    }
                }
                this.className = 'active';

                // 创建子菜单
                if (!li.children.length) {
                    var uls = this.parentNode.querySelectorAll('ul');
                    for (var i=0; i<uls.length; i++) {
                        uls[i].parentNode.removeChild(uls[i]);
                    }
                    if (item.children) {
                        var ul = document.createElement('ul');
                        this.appendChild(ul);
                        showContextmenu({el:ul,data:item.children});
                    }
                }
            };

            li.onmouseout = function(e) {
                if (item.disabled) {
                    return;
                }
                if (!this.children.length) {
                    this.className = '';
                }
            }
        }

        target.el.appendChild(li);
    } )
}

//上传文件
(function () {
    file.onchange = function (e) {
        var type = file.files[0].type.split('/')[0];
        var files = file.files[0];
        if (!(type == "text" || type == "image" || type == "video" || type == "audio")) {
            alert("目前只支持图片、视频、和音频文档的上传");
            return;
        }
        createFile(type,files);
        file.value = '';
    };
})();
function createFile(type,file) {
    var li = document.createElement('li');
    var offset = getfileOffset();
    li.style.left = offset.x + 'px';
    li.style.top = offset.y +'px';
    li.className = 'floder';
    li.type = type;
    li.index = getMaxId();
    var fileName,filePosition;
    switch (type){
        case 'file':
            fileName = '新建文件夹';
            filePosition =  '20px 10px;';
            break;
        case 'text':
            fileName = file.name;
            filePosition = '-95px -215px';
            break;
        case 'image':
            fileName = file.name;
            filePosition = '20px -328px';
            break;
        case 'audio':
            fileName = file.name;
            filePosition = '20px -670px';
            break;
        case 'video':
            fileName = file.name;
            filePosition = '-208px -440px';
            break;
    }
    li.style.backgroundPosition = filePosition;
    li.innerHTML = '<span>'+fileName+'</span><input text="text"/>';
    var item = {
        id:getMaxId(),
        pid:0,
        type:type,
        name:fileName
    };
    data.list.push(item);
    setEvent(li,item,file);
    elements.list.appendChild(li);
}
function setEvent(li,item,file) {
    var span = li.getElementsByTagName('span')[0];
    var input = li.getElementsByTagName('input')[0];
    span.addEventListener('dblclick',function (e) {
        elements.elementMenu.style.display = 'none';
        elements.contextmenu.style.display = 'none';
        e.stopPropagation();
        this.style.display = 'none';
        input.style.display = 'block';
        input.value = span.innerHTML;
        input.focus();
    });
    function hasName(input,span) {
        var lis = elements.list.querySelectorAll('li>span');
        for(var i=0;i<lis.length;i++){
            if(span!=lis[i]&&lis[i].innerHTML == input){
                return true;
            }
        }
        return false;
    }
    input.onblur = function (e) {
        data.list.forEach(function (item) {
            if(item.extname){
                if(input.value == (item.name+'('+item.extname+')'||hasName(input.value,span))){
                    elements.info.innerHTML = '重名了,请重新输入';
                    elements.info.classList.add('show');
                    setTimeout(function () {
                        elements.info.classList.remove('show');
                    },2000);
                    input.focus();
                    input.parentNode.classList.add('active');
                    return;
                }
            }
        });
        if(input.value.indexOf('新建文件夹（')!=-1&&input.value!='新建文件夹'){
            var v1 = input.value.lastIndexOf('(');
            var v2 = input.value.lastIndexOf(')');
            var v3 = input.value.substring(v1+1,v2);
            item.extname = v3;
            item.name = input.value.substring(0,v1);
        }else{
            if(hasName(input.value,span)){
                elements.info.innerHTML = '重名了,请重新输入';
                elements.info.classList.add('show');
                setTimeout(function () {
                    elements.info.classList.remove('show');
                },2000);
                input.focus();
                input.parentNode.classList.add('active');
                return;
            }else{
                item.name = input.value;
            }
        }

        if (input.value.trim("") != "") {
            span.innerHTML = input.value;
        }
        span.style.display = "block";
        input.style.display = "none";
        // if(input.style.display =='block'){
        //     item.name = input.value;
        // }
        view(_ID)



    };
    li.ondblclick = function() {
        liArr.push(this.item);
        // 获取当前点击的数据的id下的所有一级子数据
        if(item.type=='floder'&&!this.dataset.ip){
            view( item.id );
        }else if(item.type=='floder'&&this.dataset.ip){
            view(item.id,arr1);
        }else {
            openFile(item.type,file);
        }


    };
    li.addEventListener('mouseover',function (e) {
        this.classList.add('hover');
        this.children[0].style.color = '#fff';
    });
    li.addEventListener('mouseout',function () {
        if(!this.classList.contains('active')){
            this.classList.remove('hover');
            this.children[0].style.color = '#000';
        }
    });
    li.addEventListener('click',function (e) {
        e.stopPropagation();
        var lis = this.parentNode.children;
        for(var i=0;i<lis.length;i++){
            lis[i].classList.remove('active');
            lis[i].classList.remove('hover');
            lis[i].children[0].style.color = '#000';
        }
        this.classList.add('active');
        this.children[0].style.color = '#fff';
    });
    //拖拽删除
    li.addEventListener('mousedown',function (e) {
        if(e.button==2){
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var nowNode = null;
        var activeNodes = null;
        var arrVale = [];//放碰撞上了的元素
        var cloneELs = [];//克隆出来的元素
        var startX = e.clientX;
        var startY = e.clientY;
        var startEls = [];
        var _this = this;
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',end);
        function move(e) {
            if(!nowNode){
                activeNodes = elements.list.querySelectorAll('.active,.hover');
                for(var i=0;i<activeNodes.length;i++){
                    var node = activeNodes[i].cloneNode(true);
                    node.style.opacity = '.5';
                    cloneELs.push(node);
                    elements.list.appendChild(node);
                    arrVale.push({
                        id:activeNodes[i].index,
                        type: activeNodes[i].type,
                        pid:activeNodes[i].pid,
                        name: activeNodes[i].children[0].innerHTML
                    });
                    data.trash = arrVale;

                    if(_this == activeNodes[i]){
                        nowNode = node;
                    }
                    startEls[i] = {
                        x:css(activeNodes[i],'left'),
                        y:css(activeNodes[i],'top')
                    }
                }
            }
            var disX = e.clientX - startX;
            var disY = e.clientY - startY;
            for(var i=0;i<cloneELs.length;i++){
                css(cloneELs[i],'left',startEls[i].x+disX);
                css(cloneELs[i],'top',disY +startEls[i].y);
            }
            if(getCollide(nowNode,trash)){
                trash.classList.add('hover');
            }else{
                trash.classList.remove('hover');
            }
            var lis = elements.list.querySelectorAll('li');
            for(var i=0;i<lis.length;i++){
                if(lis[i]!=li&&getCollide(nowNode,lis[i])&&lis[i]!=nowNode){
                    for(var j=0;j<lis.length;j++){
                        lis[j].classList.remove('active');
                    }
                    lis[i].classList.add('active');
                }
            }
        }
        function end(e) {
            document.removeEventListener('mousemove',move);
            document.removeEventListener('mouseup',end);
            var lis = elements.list.querySelectorAll('li');
            if(!nowNode){
                return;
            }
            if (getCollide(nowNode, trash)) {
                arrVale.forEach(function (item) {
                    arrParent.push(item);

                    var childs = getchilds(item.id);

                    data.list = data.list.filter(function (items) {
                        if(items.id==item.id){
                            return false
                        }
                        return true;
                    });

                    if(childs.length){
                        childs.forEach(function (child) {
                            data.list = data.list.filter(function (items) {
                                if(items.id == child.id){
                                    arr1.push(child);
                                    return false;
                                }
                                return true;
                            })
                        });
                    }else{
                        data.list = data.list.filter(function (items) {
                            if(items.id == item.id){
                                return false
                            }
                            return true;
                        })
                    }
                });
                for(var i=0;i<cloneELs.length;i++){
                    elements.list.removeChild(cloneELs[i]);
                    trash.classList.remove("hover");
                }
                view(_ID);
            }else{
                for(var i=0;i<lis.length;i++){
                    if(lis[i]!=li&&lis[i]!=nowNode&&lis[i].classList.contains('active')){
                        if(getCollide(nowNode,lis[i])){
                            li.item.pid = lis[i].item.id;
                        }
                    }
                }
                for(var j=0;j<cloneELs.length;j++){
                    elements.list.removeChild(cloneELs[j]);
                }
                view(_ID);
            }
        trash.classList.remove("hover");
        }
    })
}
//打开文件
var fileDetail = document.querySelector('#fileDetail');
var fileDetailCols = document.querySelector('.fileDetailCols');
var fileDetailsC = fileDetail.children[0];
fileDetailCols.addEventListener('click', function(e) {
    fileDetailsC.innerHTML = "";
    fileDetail.style.display = "none";
});
fileDetail.addEventListener('click', function(e) {
    e.stopPropagation();
});
fileDetail.addEventListener('contextmenu', function(e) {
    e.stopPropagation();
    e.preventDefault();
});
fileDetail.addEventListener('mousedown', function(e) {
    e.stopPropagation();
});
function openFile(fileType,file) {
    fileDetailsC.innerHTML = "";
    var reader = new FileReader();
    reader.onload = function(e) {
        fileDetail.style.display = "block";
        var result = e.target.result;
        if (fileType == "text") {
            var p = document.createElement("p");
            p.innerHTML = result;
            fileDetailsC.appendChild(p);

        } else if (fileType == "image") {
            var img = new Image();
            img.src = result;
            fileDetailsC.appendChild(img);
        } else if (fileType == "video") {
            var video = document.createElement('video');
            video.setAttribute("loop", "");
            video.setAttribute("controls", "");
            video.src = result;
            fileDetailsC.appendChild(video);
        } else if (fileType == "audio") {
            var audio = document.createElement('audio');
            audio.setAttribute("loop", "");
            audio.setAttribute("controls", "");
            audio.src = result;
            fileDetailsC.appendChild(audio);
        }
    };
    if (fileType == "text") {
        reader.readAsText(file);
    } else {
        reader.readAsDataURL(file);
    }
}






