//表格排序提取
function MyTableSorter(table)
{
    this.Table = this.$(table);
    if(arguments.length >1){
     this.Countrow=arguments[1];
    }
    if(this.Table.rows.length <= 1)
    {
        return;
    }
    var args = [];
    if(arguments.length >2)
    {
        for(var x = 2; x < arguments.length; x++)
        {
            args.push(arguments[x]);
        }
    }
    //插入样式
    this.addStyle();
    //初始化静态表格
    this.Init(args);
}

MyTableSorter.prototype = {
    styles:".SortDescCss::after {content:'↓';}" +
    ".SortAscCss::after {content:'↑';}",
    addStyle:function(){
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML=this.styles;
        document.getElementsByTagName("head").item(0).appendChild(style);
    },
    $ : function(element)//简写document.getElementById
    {
        return document.getElementById(element);
    },
    Init : function(args)//初始化表格的信息和操作
    {
        this.Rows = [];
        this.Header = [];
        this.ViewState = [];
        this.LastSorted = null;
        this.NormalCss = "NormalCss";
        this.SortAscCss = "SortAscCss";
        this.SortDescCss = "SortDescCss";
        for(var x = 0; x < this.Table.rows.length; x++)
        {
            this.Rows.push(this.Table.rows[x]);
        }
        this.Header = this.Rows.shift().cells;
        //此处新增剔除统计排序
        // console.log(this.Countrow);
        if(this.Countrow=="sum"){
            this.Rows.shift().cells;
        }

        for(var x = 0; x < (args.length ? args.length : this.Header.length); x++)
        {
            var rowIndex = args.length ? args[x] : x;
            if(rowIndex >= this.Header.length)
            {
                continue;
            }
            this.ViewState[rowIndex] = false;
            this.Header[rowIndex].style.cursor = "pointer";
            this.Header[rowIndex].onclick = this.GetFunction(this, "Sort", rowIndex);
        }
    },
    GetFunction : function(variable,method,param)//取得指定对象的指定方法.
    {
        return function()
        {
            variable[method](param);
        }
    },
    Sort : function(column)//执行排序.
    {
        if(this.LastSorted)
        {
            this.LastSorted.className = this.NormalCss;
        }
        var SortAsNumber = true;
        for(var x = 0; x < this.Rows.length && SortAsNumber; x++)
        {
            SortAsNumber = this.IsNumeric(this.Rows[x].cells[column].innerHTML);
        }
        this.Rows.sort(
            function(row1, row2)
            {
                var result;
                var value1,value2;
                value1 = row1.cells[column].innerHTML;
                value2 = row2.cells[column].innerHTML;
                if(value1 == value2)
                {
                    return 0;
                }
                if(SortAsNumber)
                {
                    result = parseFloat(value1) > parseFloat(value2);
                }
                else
                {
                    result = value1 > value2;
                }
                result = result ? 1 : -1;
                return result;
            })
        if(this.ViewState[column])
        {
            this.Rows.reverse();
            this.ViewState[column] = false;
            this.Header[column].className = this.SortDescCss;
        }
        else
        {
            this.ViewState[column] = true;
            this.Header[column].className = this.SortAscCss;
        }
        this.LastSorted = this.Header[column];
        var frag = document.createDocumentFragment();
        for(var x = 0; x < this.Rows.length; x++)
        {
            frag.appendChild(this.Rows[x]);
        }
        this.Table.tBodies[0].appendChild(frag);
        this.OnSorted(this.Header[column], this.ViewState[column]);
    },
    IsNumeric : function(num)//验证是否是数字类型.
    {
        return /^\d+(\.\d+)?$/.test(num);
    },
    OnSorted : function(cell, IsAsc)//排序完后执行的方法.cell:执行排序列的表头单元格,IsAsc:是否为升序排序.
    {
        return;
    }
}