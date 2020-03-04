
import React, { Component } from "react";
//import {Button, message} from 'antd'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";
/*
应用的根组件
*/
export default class App extends Component{
    // handleClick = () => {
    //     message.success('我被点了')
    // }

    render(){
    //     return <div>
    //     <Button type="primary" onClick={this.handleClick}>Primary</Button>

    //   </div>
        return (
            <BrowserRouter>
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path='/' component={Admin}></Route>
            </Switch>
            </BrowserRouter>
        )
    }
}