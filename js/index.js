var elements = {
    list: document.querySelector('#list'),
    filename: document.querySelector('#filename'),
    filetype: document.querySelector('#filetype'),
    // createBtn: document.querySelector('#createBtn'),
    contextmenu: document.querySelector('#contextmenu'),
    paths: document.querySelector('#paths'),
    back: document.querySelector('#back'),
    crumbs: document.querySelector('#crumbs'),
    trash:document.querySelector('#trash'),
    elementMenu:document.querySelector('#elementMenu'),
    file:document.querySelector('#file'),
    wrap:document.querySelector('#wrap'),
    trashMenu:document.querySelector('#trashMenu'),
    info:document.querySelector('#info')
};
var StickArr = [];//复制的元素数据
var liArr = [];//当前双击进去的是谁

document.addEventListener('mousedown',function (e) {

    var lis = elements.list.querySelectorAll('li');
    for(var i=0;i<lis.length;i++){
        lis[i].classList.remove('active');
        lis[i].classList.remove('hover');
        lis[i].children[0].style.color = '#000';
    }
});

// 当前所在目录的id，每当视图发生改变的时候，也就是view方法执行的时候，需要同步该值
var _ID = 0;

// 渲染初始化数据，显示pid为0的数据
view( _ID );


elements.back.onclick = function(e) {
    // 返回上一级：获取当前目录的父级的子目录
    var info = getInfo(_ID);

    if (info) {
        view( info.pid );
    }
};
move();
//动画开始
function move() {
    elements.trash.classList.add('show');
    elements.paths.classList.add('show');
    elements.list.classList.add('show');
}

// // 创建文件、文件夹
// elements.createBtn.onclick = function () {
//     addData({
//         pid: _ID,
//         type: elements.filetype.value,
//         name: elements.filename.value
//     });
//     view(_ID);
// };
//创建上下文菜单
document.addEventListener('contextmenu',function (e) {
    if(e.target.tagName.toUpperCase() == 'LI'&&!e.target.dataset.ip){
        e.target.classList.add('active');
        elements.contextmenu.style.display = 'none';
        elements.elementMenu.innerHTML = '';
        elements.elementMenu.style.display = 'block';
        elements.elementMenu.style.left = e.clientX +'px';
        elements.elementMenu.style.top = e.clientY +'px';
        var target = {
            el:elements.elementMenu,
            data:data.menu.file,
            index:e.target.index,
            obj:e.target
        };
        showContextmenu(target);
    }else if(e.target.dataset.ip&&e.target.tagName.toUpperCase() == 'LI'){
        e.target.classList.add('active');
        elements.contextmenu.style.display = 'none';
        elements.trashMenu.innerHTML = '';
        elements.trashMenu.style.display = 'block';
        elements.trashMenu.style.left = e.clientX +'px';
        elements.trashMenu.style.top = e.clientY +'px';
        var target = {
            el:elements.trashMenu,
            data:data.trashMenu,
            index:e.target.index,
            item:e.target.item,
            obj:e.target
        };
        showContextmenu(target);

    }else{
        var target = {
            el:elements.contextmenu,
            data:data.menu.main,
            index:e.target.index,
            obj:e.target
        };
        elements.elementMenu.style.display = 'none';
        elements.contextmenu.innerHTML = '';
        elements.contextmenu.style.display = 'block';
        elements.contextmenu.style.left = e.clientX +'px';
        elements.contextmenu.style.top = e.clientY +'px';
        showContextmenu(target);
    }
    e.preventDefault();
});

//垃圾桶双击
var arr1 =[];
var arrParent = [];//垃圾桶里面添加进去的父级

trash.addEventListener('dblclick',function (e) {
    e.stopPropagation();
    data.trash = arr1.concat(arrParent);
    view(_ID,arrParent);
});









