import React,{ Component } from "react";
import { Button, Tooltip ,Icon} from 'antd';
import { FileSearchOutline } from '@ant-design/icons';

export default class Test extends Component{
  render(){
    return <div>
    <Tooltip title="search">
      <Button type="primary" shape="circle" icon={<FileSearchOutline />} />
    </Tooltip>
    <Button type="primary" shape="circle">
      A
    </Button>
    <Button type="primary" icon={<FileSearchOutline />}>
      Search
    </Button>
    <Tooltip title="search">
      <Button shape="circle" icon={<FileSearchOutline />} />
    </Tooltip>
    <Button icon={<FileSearchOutline />}>Search</Button>
    <br />
    <Tooltip title="search">
      <Button shape="circle" icon={<FileSearchOutline />} />
    </Tooltip>
    <Button icon={<FileSearchOutline />}>Search</Button>
    <Tooltip title="search">
      <Button type="dashed" shape="circle" icon={<FileSearchOutline />} />
    </Tooltip>
    <Button type="dashed" icon={<FileSearchOutline />}>
      Search
    </Button>
    <Icon type="question-circle" theme="twoTone" />
  </div>
  }
}
