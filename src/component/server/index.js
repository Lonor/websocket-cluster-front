import React, { Component } from 'react'
import Button from './../button'
import './../../App.css';

const baseURL = `http://localhost:7000`

export default class ServerList extends Component {
    state = {
        containers: [],
        serverInfo: [],
    }

    // 更新
    updateServerInfo = (ip, userCount) => {
        console.log(`更新 ip 为 ${ip} 的数量到 ${userCount}`)
        const { serverInfo } = this.state
        // 判断是否已经有 IP
        if (!serverInfo.some((element) => {
            const sameIp = element.ip === ip
            if (sameIp) {
                element.userCount = userCount
            }
            return sameIp
        })) {
            serverInfo.push({ ip, userCount })
            // todo 服务下线后也需要更新或删除
        }
        this.setState({
            serverInfo
        })
    }

    async componentDidMount() {
        // 为了在父组件中调用子组件的方法
        this.props.onRef(this)
        // 获取服务列表
        await this.getContainer()
    }

    createContainer = async () => {
        const res = await fetch(`${baseURL}/docker/run?imageName=websocket:1.0.0`);
        const id = await res.text();
        console.log(`OK with id: ${id}`)
        await this.getContainer();
    }

    removeContainer = async (containerId) => {
        const res = await fetch(`${baseURL}/docker/rm?containerId=${containerId}`);
        const id = await res.text();
        console.log(`Deleted ${id}`)
        await this.getContainer();
    }

    getContainer = async () => {
        const res = await fetch(`${baseURL}/docker/ps?containerName=websocket`)
        const ps = await res.json()
        console.log(ps)
        this.setState({
            containers: ps,
        })
    }

    render() {
        const { serverInfo } = this.state;
        console.log(serverInfo);

        return (
            <div className='top20'>
                <Button onClick={this.getContainer}>刷新服务列表</Button>
                <table style={{ margin: '0 auto' }}>
                    <thead>
                        <tr>
                            <th>🐳 ContainerID</th>
                            <th>ImageName</th>
                            <th>ContainerName</th>
                            <th>ClusterIP</th>
                            <th>State</th>
                            <th>WebSocketClients</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.containers.map((v, i) => {
                            const serverIPAddress = v.NetworkSettings.Networks['compose-network'].IPAddress
                            return <tr key={i}>
                                <td>{v.Id.slice(0, 12)}</td>
                                <td>{v.Image}</td>
                                <td>{v.Names[0].slice(1)}</td>
                                <td>{serverIPAddress}</td>
                                <td><div className={v.State === 'running' ? 'up' : 'down'}></div></td>
                                <td>{serverInfo.filter((element) => {
                                    return element.ip === serverIPAddress
                                }).map((v) => {
                                    return v.userCount
                                })}
                                </td>
                                <td>{<Button onClick={() => this.removeContainer(v.Id)}>下线</Button>}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <Button onClick={this.createContainer}>
                    + WebSocket 服务实例
                </Button>
            </div>
        )
    }
}
