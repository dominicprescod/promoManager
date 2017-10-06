const Children = (props) => {
  return (
    <ul id="children">
    {props.children.map((v,i,a)=>{
      return <li className="children_li" key={i}>{v.tagName}</li>
    })}
    </ul>
  )
}

const Header = (props) => {
  return (
    <header id="main_header">
      <div id="main_header_left">
        <h1 id="main_header_left_h1">{props.tagName}</h1>
      </div>
      <div id="main_header_center">
        <h1 id="main_header_center_h1">Children</h1>
        <Children children={props.children}/>
      </div>
      <div id="main_header_right">
        <button id="main_header_right_button">Sibling</button>
      </div>
    </header>
  )
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}


class PopUp extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        attrName: isEmpty(this.props.editAttr) ? "" : this.props.editAttr.attrName,
        attrValue: isEmpty(this.props.editAttr) ? "" : this.props.editAttr.attrValue
      }
      this.attrNameChange = this.attrNameChange.bind(this);
      this.attrValueChange = this.attrValueChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    attrNameChange(event){this.setState({attrName: event.target.value})}
    attrValueChange(event){this.setState({attrValue: event.target.value})}

    handleSubmit(event){
      this.props.cancelHandler();

      if(!isEmpty(this.props.editAttr)){
        console.log("inside edit")
        console.log(this.props.editAttr)
        var updatedObj = {
          attrName: this.state.attrName,
          attrValue: this.state.attrValue,
          index: this.props.editAttr.index
        }
        this.props.finishEdit(updatedObj);
      } else {
        console.log("inside add")
        this.props.addAttr(this.state);
      }
      this.setState({attrValue:"",attrName:""});
    }

    render() {
      return(
        <div id="popup" className={this.props.showMe ? "visible":"invisible"}>
          <h1 id="popup_h1">Enter Attribute</h1>
          <div id="popup_inputContainer">
            <div id="popup_inputContainer_inputDiv">
              <input className="popup_inputContainer_inputDiv_input" placeholder="AttrName" value={this.state.attrName} onChange={this.attrNameChange}/>
              <input className="popup_inputContainer_inputDiv_input" placeholder="AttrValue" value={this.state.attrValue} onChange={this.attrValueChange}/>
            </div>

          </div>
          <div id="popup_buttonContainer">
            <button className="popup_buttonContainer_button" onClick={this.handleSubmit} >Save</button>
            <button className="popup_buttonContainer_button -cancel" onClick={this.props.cancelHandler}>Cancel</button>
          </div>
        </div>
      )
    }
}

const Attrs = (props) => {

  return (
    <ul id="main_main_left_attrContainer_ul">
    {props.attrList.map((v,i,a)=>
       <li className="main_main_left_attrContainer_ul_li" key={i} onClick={()=>{props.editAttr({attrName:Object.keys(v)[0],attrValue: v[Object.keys(v)[0]],index:i})}}>
        <p className="main_main_left_attrContainer_ul_li_input">{Object.keys(v)[0]}</p>
        <p className="main_main_left_attrContainer_ul_li_input">{v[Object.keys(v)[0]]}</p>
      </li>
    )}
    </ul>
  )
}

const AttrContainer = (props) => {
  return (
          <div id="main_main_left_attrContainer">
            <Attrs attrList={props.attrList} editAttr={props.editAttr}/>
            <button type="button" name="button" id="main_main_left_attrContainer_button" onClick={props.showHandler}>Add Attribute</button>
          </div>
        );
}

const MainLeft = (props) =>{

      let sendTagName = (event) => {
        props.getTagName(event.target.value)
      }

      return (
        <div id="main_main_left">
          <input placeholder="TagName" id="main_main_left_TagName" onChange={sendTagName}/>
          <AttrContainer attrList={props.attrList} showHandler={props.showHandler} editAttr={props.editAttr}/>
        </div>
      )
}

class MainCenter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: ""
    }
    this.valueChange = this.valueChange.bind(this);
  }
  // send value to the MAIN element
  valueChange(data){
    this.setState({value:data.target.value})
    this.props.getValue({value:data.target.value});
  }

  render() {
    return (
      <div id="main_main_center">
        <div id="main_main_center_container">
          <input type="text" placeholder="Value" id="main_main_center_container_input" value={this.state.value} onChange={this.valueChange}/>
            <button type="button" name="button" className="main_main_center_container_button" disabled={this.props.disable}>Child Element</button>
            <button type="buttclasson" name="button" className="main_main_center_container_button" disabled={this.props.disable}>List Elements</button>
        </div>
      </div>
    )
  }
}

const MainMain = (props) => {
  return (
    <main id="main_main">
      <MainLeft attrList={props.attrList} showHandler={props.showHandler} editAttr={props.editAttr} getTagName={props.getTagName}/>
      <MainCenter value={props.value} getValue={props.getValue} disable={props.disable}/>
    </main>
  )
}

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tagName: "TagName",
      value: "",
      children:[
        {
          tagName:"firstChild",
          value:"",
          children:[],
          listElement: false
        },
        {
          tagName:"secondChild",
          value:"",
          children:[],
          listElement: false
        },
        {
          tagName:"thirdChild",
          value:"",
          children:[],
          listElement: false
        },
        {
          tagName:"lastChild",
          value:"",
          children:[],
          listElement: false
        }
      ],
      listElement: false,
      attrList: [],
      getAttr: false,
      editAttr: {}
      /*
      ########****RESTRICTIONS******########
            .1 Cannot enter Child || List Element when a value is entererd
            .2 List elements are child elements
            .3 ALL Child elements MUST have a parent
            .4 ABSOLUTE Parent element MUST have a requestId
      */
    }

    this.showHandler = this.showHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.addAttr = this.addAttr.bind(this);
    this.startEditAttr = this.startEditAttr.bind(this);
    this.finishEdit = this.finishEdit.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getTagName = this.getTagName.bind(this);
  }

  cancelHandler(){this.setState({getAttr: false, editAttr: {}});}
  showHandler(){this.setState({getAttr: true})}
  addAttr(data){

    var newAttr = { };
    newAttr[data.attrName] = data.attrValue;
    var arr = this.state.attrList;
    arr.push(newAttr);
    this.setState({attrList:arr});
  }

  startEditAttr(data){
    console.log("inside startEditAttr");
    console.log(data);
    this.setState({
      editAttr: data,
      getAttr: true
    });
  }

  finishEdit(data){
    console.log("inside finishEdit")
    console.log(data)
    var attrList = this.state.attrList;
    attrList[data.index] = {};
    attrList[data.index][data.attrName] = data.attrValue;
    delete attrList[data.index].index;
    this.setState({attrList:attrList, editAttr: {}});
  }

  getValue(data){
      this.setState(data);
  }

  getTagName(data){
    this.setState({tagName: data})
  }

  render(){
    const {
      attrList,
      getAttr,
      children,
      editAttr,
      value,
      tagName
    } = this.state;

    return (
      <div id="main">
        <Header children={children} tagName={tagName}/>
        <MainMain
          disable={value == "" ? false : true}
          getValue={this.getValue}
          getTagName={this.getTagName}
          value={value}
          editAttr={this.startEditAttr}
          attrList={attrList}
          showHandler={this.showHandler}
        />
        <PopUp
          showMe={getAttr}
          cancelHandler={this.cancelHandler}
          addAttr={this.addAttr}
          editAttr={editAttr}
          finishEdit={this.finishEdit}
        />
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
