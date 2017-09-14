class Dashboard extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Dashboard</h1>
      </div>
    )
  }
}


class App extends React.Component {
    render() {
        return (
            <div>
                <Dashboard />
            </div>
        );
    }
}


ReactDOM.render(
    <App/>,document.getElementById("main")
)
