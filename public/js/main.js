const Header = (props) => {
  return (
    <header id="main_header">
      <h1> Dashboard</h1>
    </header>
  )
}

class AttrContainer extends React.Component {
    render() {
      return (
        <div id="main_main_left_attrContainer">
          <ul id="main_main_left_attrContainer_ul">
          <li className="main_main_left_attrContainer_ul_li">
            <input type="text" placeholder="attrName" className="main_main_left_attrContainer_ul_li_input" />
            <input type="text" placeholder="attrValue" className="main_main_left_attrContainer_ul_li_input" />
          </li>
          </ul>
          <button type="button" name="button" id="main_main_left_attrContainer_button">Add Attribute</button>
        </div>
      );
    }
}

class MainLeft extends React.Component {
    render() {
      return (
        <div id="main_main_left">
          <input placeholder="TagName" id="main_main_left_TagName" />
          <AttrContainer />
        </div>
      )
    }
}

const MainCenter = (props) => {
  return (
    <div id="main_main_center">
      <div id="main_main_center_container">
        <input type="text" placeholder="Value" id="main_main_center_container_input"/>
          <button type="button" name="button" className="main_main_center_container_button">Child Element</button>
          <button type="buttclasson" name="button" className="main_main_center_container_button">List Element</button>
      </div>
    </div>
  )
}

const MainMain = (props) => {
  return (
    <main id="main_main">
      <MainLeft />
      <MainCenter />
    </main>
  )
}

class Main extends React.Component {
  render() {
    return (
      <div id="main">
        <Header />
        <MainMain />
      </div>
    )
  }
}


class App extends React.Component {
    render() {
        return (
                <container id="container">
                  <Main />
                </container>
        );
    }
}


ReactDOM.render(
    <App/>,document.getElementsByTagName("body")[0]
)
