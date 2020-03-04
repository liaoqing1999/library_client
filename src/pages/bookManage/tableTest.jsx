import { Table, Button,Input } from 'antd';
import React,{ Component } from "react";
import { reqBooks, reqTypeName } from '../../api';
import Highlighter from 'react-highlight-words';


export default class App extends Component {
    
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    pageSize:10,
    totals:0,
    pageNum:1,
    tableData : [],
    filters:[],
  };
    paginationProps = {
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal: () => `共${this.state.totals}条`,
    total: this.state.totals,
    onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
    onChange: (current) => this.changePage(current),
    };
    changePage = (current) =>{
    
      this.getBooks(current,this.state.pageSize,'','',JSON.stringify({filters:this.state.filters}))
      this.setState({
        pageNum: current,
      });
    }
// 回调函数,每页显示多少条
  changePageSize = (pageSize,current) =>{
    // 将当前改变的每页条数存到state中
    this.getBooks(this.state.pageNum,pageSize,'','',JSON.stringify({filters:this.state.filters}))
    this.setState({
      pageSize: pageSize,
    });
    
  }
  getBooks =async (page,rows,sidx,sord,cond) =>{
    const books = await reqBooks(page,rows,sidx,sord,cond)
    const data = [];
    
    if(books){
        books.data.contents.forEach(async item =>  {
          const typeName = await reqTypeName(item.typeId)
          if(typeName){
            item.typeName = typeName.data
            data.push(item)
            this.setState({ typeName: typeName.data });
          }
        })
        this.paginationProps.total = books.data.total
        this.setState({ tableData: data ,totals: books.data.total});
    }
   
    }
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          查找
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          取消
        </Button>
      </div>
    ),
   
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    var filters={
      groupOp:"AND",
          rules:[
             {field:dataIndex,op:"cn",data:selectedKeys[0]} 
          ]
  }
  //$view.列表id.refresh({filters:filters}) 
    confirm();
    this.setState({
      filters:filters,
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
    this.getBooks(this.state.pageNum,this.state.pageSize,'','',JSON.stringify({filters:filters}))
   
  };

  handleReset = clearFilters => {
    console.log(clearFilters)
    clearFilters();
    this.setState({ searchText: '' , filters:[],});
    this.getBooks(this.state.pageNum,this.state.pageSize)
  };

  componentDidMount(){
    this.getBooks(this.state.pageNum,this.state.pageSize)
  }
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: 'id',
        fixed: 'left',
        width: 80,
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id'),
      },
      {
        title: '书名',
        dataIndex: 'bookName',
        fixed: 'left',
        key: 'bookName',
        width: 100,
        ...this.getColumnSearchProps('bookName'),
      },
      {
        title: '描述',
        dataIndex: 'des',
        key: 'des',
        ...this.getColumnSearchProps('des'),
      },
      {
        title: '作者',
        dataIndex: 'writer',
        key: 'writer',
        ...this.getColumnSearchProps('writer'),
      },
      {
        title: '出版社',
        dataIndex: 'printer',
        key: 'printer',
        ...this.getColumnSearchProps('printer'),
      },
      {
        title: '类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '存放地点',
        dataIndex: 'place',
        key: 'place',
        ...this.getColumnSearchProps('place'),
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        ...this.getColumnSearchProps('price'),
      },
      {
        title: '馆藏量',
        dataIndex: 'store',
        key: 'store',
        ...this.getColumnSearchProps('store'),
      },
      
    ];
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table  scroll={{ x: 1500, y: 300 }} pagination={this.paginationProps} rowKey={record =>record.id} rowSelection={rowSelection} columns={columns} dataSource={this.state.tableData} />
      </div>
    );
  }
}
