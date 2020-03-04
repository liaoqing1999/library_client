import React,{ Component } from "react";
import { reqBookTypeAll, reqBooks, reqTypeName } from "../../api";
import { Tree, Icon,Table, Button,Input } from 'antd';
import Highlighter from 'react-highlight-words';
import './bookType.less'
import MyTable from "../../utils/table";

const { TreeNode } = Tree;

export default class BookType extends Component{
    state = {
        treeData: [],        //树数据
        selectedRowKeys: [], // 已选列
        loading: false,      //是否加载
        pageSize:10,         //表页大小
        totals:0,            //表数据总量
        pageNum:1,           //第几页
        tableData : [],      //表数据
        filters:[],          //条件
    }
    
    //获取某节点的孩子节点
    getChiled = (data,id) => {
        const c = []; 
        data.forEach(item =>{
            let children = [];
            if(item.pid===id){
                children = this.getChiled(data,item.id)
                if(children.length===0){
                    c.push({key:item.id,title:item.name})
                }else{
                    c.push({key:item.id,title:item.name,children:children})
                }
                
            }
        })
        return c;
    }
    //将类型数据转换成树数据
    generateData = (data) => {
      const dataList = []
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { id,name,pid } = node;
            let children = [];
            
            if(pid ==='0'){
                children = this.getChiled(data,id)
                dataList.push({ key:id, title: name ,children :children});
            }
        }
    this.setState({treeData:dataList})
    };
    //循环返回树形语句
    loop = data =>{
        return data.reduce((pre,item)=>{
            if(item.children){
                pre.push((
                    <TreeNode icon={<Icon type="folder" theme="twoTone" />} key={item.key} title={item.title} >
                    {this.loop(item.children)}
                  </TreeNode>
                    ))
            }else{
                pre.push((
                    <TreeNode icon={<Icon type="book" theme="twoTone" />} key={item.key} title={item.title} />
                ))
            }  
            
            return pre
        },[])
    }
    //获取 类型数据
    getBookTypes =async () =>{
        const bookTypes = await reqBookTypeAll()
        if(bookTypes){
            this.generateData(bookTypes.data)
        }
       
    }

  getDates = async (page,rows,sidx,sord,cond) =>{
    console.log("1111")
    const datas = await reqBooks(page,rows,sidx,sord,cond)
    return datas;
  }
  //render前事件
    componentDidMount(){
        this.getBookTypes()
        //this.getBooks(this.state.pageNum,this.state.pageSize)
    }
    render(){
       
        const columns = [
          {
            title: 'id',
            fixed: 'left',
            width: 80,
            dataIndex: 'id',
            key: 'id',
          
          },
          {
            title: '书名',
            dataIndex: 'bookName',
            fixed: 'left',
            key: 'bookName',
            width: 100,
           
          },
          {
            title: '描述',
            dataIndex: 'des',
            key: 'des',
           
          },
          {
            title: '作者',
            dataIndex: 'writer',
            key: 'writer',
            width: 80,
            
          },
          {
            title: '出版社',
            dataIndex: 'printer',
            key: 'printer',
            width: 80,
            
          },
          
          {
            title: '存放地点',
            dataIndex: 'place',
            width: 80,
            key: 'place',
           
          },
          {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 80,
           
          },
          {
            title: '馆藏量',
            dataIndex: 'store',
            key: 'store',
            width: 80,
           
          },
          
        ];
        return (
            <div className="bookType"> 
            <div className="bookType-typeTree"> 
                {
            this.state.treeData.length ? (
                <Tree
                showIcon
                switcherIcon={<Icon type="down" />}
                > 
                {this.loop(this.state.treeData)}
                </Tree>
            ) : (
                'loading tree'
            )
            }
          </div>
          <div className="bookType-bookTable">
          
          <MyTable columns={columns} getDates ={this.getDates}></MyTable>
        </div>
        </div>
        )
    }
}