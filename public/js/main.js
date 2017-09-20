const Header = (props) => {
  return (
    <header id="main_header">
      <h1> Dashboard</h1>
    </header>
  )
}

const Attrs = (props) => {
  return (
    <ul id="main_main_left_attrContainer_ul">
    {props.attrList.map((v,i,a)=>
       <li className="main_main_left_attrContainer_ul_li" key={i}>
        <input type="text" placeholder={Object.keys(v)[0]} className="main_main_left_attrContainer_ul_li_input" />
        <input type="text" placeholder={v[Object.keys(v)[0]]} className="main_main_left_attrContainer_ul_li_input" />
      </li>
    )}xzf
    </ul>
  )
}

class AttrContainer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      attrList: []
    }
  }
    handleClick(){
      var arr = this.state.attrList;
      arr.push({newAttrName: "newAttrValue"});
      this.setState({attrList: arr});
    }

    handleDataChange(data){

    }
    render() {
      const {
        attrList
      } = this.state;
      return (
        <div id="main_main_left_attrContainer">
          <Attrs attrList={attrList} />
          <button type="button" name="button" id="main_main_left_attrContainer_button" onClick={()=>{this.handleClick()}}>Add Attribute</button>
        </div>
      );
    }
}

const MainLeft = (props) =>{
      return (
        <div id="main_main_left">
          <input placeholder="TagName" id="main_main_left_TagName" />
          <AttrContainer />
        </div>
      )
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

const Main = (props) => {
    return (
      <div id="main">
        <Header />
        <MainMain />
      </div>
    )
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
