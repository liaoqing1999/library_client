import React, { Component } from "react";
import './login.less';
import logo from '../../assets/book.svg'
import { Form, Icon, Input, Button,  message } from 'antd';
import {reqLogin, reqLoginUser} from '../../api/index'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from 'react-router-dom'

export class Login extends Component{
    handleSubmit = (event) => {
        //阻止事件的默认行为
        event.preventDefault()
       
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
             
              const {account,password} = values;
              try {
                await reqLogin(account,password)
                message.success("登陆成功")
                reqLoginUser(account).then(response =>{
                    const user = response.data
                    memoryUtils.user =  user //保存在内存中
                    storageUtils.savaUser(user)
                    this.props.history.replace('/')
                })
               
              } catch (error) {
                message.error("用户名或密码错误")
              }
            
            }
          });
    }
   
    render(){
        //如果用户已经登录，自动跳转到首页
        const user = memoryUtils.user
        if(user&&user.id){
            return <Redirect to = '/' />
        }
        const form = this.props.form;
        const { getFieldDecorator } = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>图书馆管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator('account',{
                                    rules: [
                                        { required: true,message: '用户名不能为空！' },
                                        {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数字或下划线组成'}

                                    ],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />
                                )
                            }
                          
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    rules: [
                                        { required: true, whitespace:true, message: '密码不能为空！' },
                                       
                                    ],
                                
                                })(
                                    <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                     />
                                )
                            }
                            
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login)
export default WrapLogin

/*
async和await
1.作用
简化promise对象的使用，消灭了then，不用在使用then（）来指定成功/失败的回调函数
以异步编码方式实现异步流程

2.哪里写await
在返回promise的表达式左侧写await：不想要promise，想要promise异步执行成功的value数据

3.哪里写async
await所在函数（最近的）定义的左侧写async
*/