class App extends React.Component {
    render () {
        return (
            <div>
                <input placeholder="Email" text="text" />
                <br/>
                <input placeholder="Email" text="text" />
            </div>
        );
    }
}



ReactDOM.render(
    <App />,
    document.getElementById('root')
);