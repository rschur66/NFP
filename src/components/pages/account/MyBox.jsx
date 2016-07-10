import React, { Component }   from 'react';
import {connect}              from 'react-redux';
import PointerLeft            from '../../elements/PointerLeft.jsx';
import PointerRight           from '../../elements/PointerRight.jsx';
import AddPaymentMethod       from './AddPaymentMethod.jsx'
import FieldsetShippingInfo   from '../../elements/FieldsetShippingInfo.jsx';
import CurrentBox             from './CurrentBox.jsx';
import PastBox                from './PastBox.jsx';
import FutureBox              from './FutureBox.jsx';
import { updateMemberShipping } from '../../../modules/member';
import { getPaymentMethod, getClientToken } from '../../../modules/member_payment_method';
import { bindActionCreators } from 'redux';
import dateformat             from "dateformat";
import {get}                  from '../../../svc/utils/net';

export default class MyBox extends Component {

  constructor(props){
    super(props);
    this.state = {
      showContent : false,
      showingEdit : '',
      address: props.member.address ?
        ({
          street1:  props.member.address.street1,
          street2:  props.member.address.street2,
          city:     props.member.address.city,
          state:    props.member.address.state,
          zip:      props.member.address.zip
        }) : ({}),
      paymentMethod: {},
      displayedMonth: !props.store_can_pick || !props.member.can_pick ? new Date( (new Date(props.storeTime).getMonth() + 2) + "/01/" + new Date(props.storeTime).getFullYear() ) : new Date(props.storeTime)
    };
    this.changeMonth = this.changeMonth.bind(this);
    this.handleShippingChange = this.handleShippingChange.bind(this);
    this.handlePaymentChange = this.handlePaymentChange.bind(this)
    this.showEdit = this.showEdit.bind(this);
    this.updateShippingAddress = this.updateShippingAddress.bind(this);
    this.updatePaymentInfo = this.updatePaymentInfo.bind(this);
  }

  componentWillMount() {
    this.props.getClientToken();
    this.props.getPaymentMethod();
    if (this.props.params.date) {
      this.setState({
        displayedMonth: new Date(this.props.params.date)
      })
    }
  }
  componentDidMount(){
    this.props.experiment.forEach(exp => {
      get(`/svc/experiment/${exp.id}/-1`);
    });
  }

  componentWillReceiveProps(nextProps){
    let AddObj = this.refs.add ? this.refs.add.getWrappedInstance() : {};
    if( nextProps.member.paymentMethod != this.props.member.paymentMethod && this.state.showingEdit === 'billTo' && AddObj.state.addPaymentSubmit ){
      AddObj.braintreeObjDestroy();
      this.showEdit('');
      AddObj.setState({ addPaymentSubmit: false });
    } else if( !this.props.braintreeError && nextProps.braintreeError && this.state.showingEdit === 'billTo' && AddObj.state.addPaymentSubmit)
      AddObj.setState({ addPaymentSubmit: false });
  }

  changeMonth(direction){
    if(direction === 'prev'){
      let newDate = new Date( new Date(this.state.displayedMonth).setMonth( this.state.displayedMonth.getMonth() -1 ));
      this.setState({ displayedMonth: newDate });
    } else { //next
       let newDate = new Date( new Date(this.state.displayedMonth).setMonth( this.state.displayedMonth.getMonth() + 1 ));
      this.setState({ displayedMonth: newDate });
    }
  }

  showEdit(thisFieldset){
    this.setState ({ showingEdit : thisFieldset });
  }

  handleShippingChange( sType, event ) {
    var oUpdate      = this.state.address;
    oUpdate[ sType ] = event.target.value;
    this.setState({ address: oUpdate });
  }

  handlePaymentChange( sType, event ) {
    var oUpdate      = this.state.paymentMethod;
    oUpdate[ sType ] = event.target.value;
    this.setState({ paymentMethod: oUpdate });
  }

  updateShippingAddress(e){
    e.preventDefault();
    let addressUpdate = { address: this.state.address };
    this.props.updateMemberShipping(addressUpdate);
    this.showEdit('');
  }

  updatePaymentInfo(e){
    e.preventDefault();
    this.showEdit('');
  }

  render(){
    let displayedMonth = this.state.displayedMonth,
        { member, store_can_pick, products, storeTime } = this.props,
        { box_history, box_future, paymentMethod, box } = member,
        editPayment = (<div className="toggledContent hide" />);
    storeTime = new Date(storeTime);
    let prevMonth = new Date( new Date(this.state.displayedMonth).setMonth( this.state.displayedMonth.getMonth() -1 )),
        nextMonth = new Date( new Date(this.state.displayedMonth).setMonth( this.state.displayedMonth.getMonth() +1 )),
        futureMonth = new Date( (storeTime.getMonth() + 2) + "/01/" + storeTime.getFullYear() ),
        leftPointerActive = ( (box_history[prevMonth.getFullYear() - 2015] && box_history[prevMonth.getFullYear() - 2015][prevMonth.getMonth()] )
        || (prevMonth.getMonth() === storeTime.getMonth() && prevMonth.getFullYear() === storeTime.getFullYear() && (box_history.length>0 || box.date_shipped ||store_can_pick)) ) ? true : false,
        rightPointerActive = ( (box_history[nextMonth.getFullYear() - 2015] && box_history[nextMonth.getFullYear() - 2015][nextMonth.getMonth()])
        || ( (nextMonth.getMonth() === storeTime.getMonth() && nextMonth.getFullYear() === storeTime.getFullYear())
        || (displayedMonth.getMonth() === storeTime.getMonth() && displayedMonth.getFullYear() === storeTime.getFullYear() && !(member.can_pick&&store_can_pick)) ) ) ? true : false,
        displayedBox = (
          <CurrentBox
            box_obj={box}
            can_pick={member.can_pick}
            date={displayedMonth} />),
        pointerLeft =  (<PointerLeft handleClick = {this.changeMonth.bind(this, 'prev')} pointerPrevActive={leftPointerActive} />),
        pointerRight =  (<PointerRight handleClick = {this.changeMonth.bind(this, 'next')} pointerNextActive={rightPointerActive} />);

    if(displayedMonth.getMonth() === futureMonth.getMonth() && displayedMonth.getFullYear() === futureMonth.getFullYear() )
      displayedBox = (<FutureBox
        box_obj={box_future}
        date={displayedMonth}
        box_history={box_history}
        box_obj={box_future}/>);
    else if( (displayedMonth.getMonth() !== storeTime.getMonth() || displayedMonth.getFullYear() !== storeTime.getFullYear())
      && box_history[displayedMonth.getFullYear() - 2015] && box_history[displayedMonth.getFullYear() - 2015][displayedMonth.getMonth()] )
      displayedBox = (<PastBox
        box_obj={box_history[displayedMonth.getFullYear() - 2015][displayedMonth.getMonth()]}
        date={displayedMonth} />);

    if( this.state.showingEdit == 'billTo')
      editPayment = (
        <div className="toggledContent show">
          <form id='hosted-fields-form'>
            <AddPaymentMethod
              ref='add'
              submitButton={true}
              showEdit={this.showEdit} />
          </form>
        </div>
      );

    return(
      <div className="bodyContent myBox">
      <div className="innerWrapper">
          <div className="borderedBox">
              <section className="boxHeader">
                {pointerLeft}
                <h2 className="center"><span>My Box:</span> <span className="highlightColor">{dateformat( displayedMonth, "mmmm yyyy")}</span></h2>
                {pointerRight}
              </section>
              {displayedBox}
              <div className="boxInfoSummary">
                  <section>
                    <span className="h6 alt">Bill to: </span>
                    <span className={"h5" + ((this.state.showingEdit==='billTo') ? ' hide' : ' show')}>Card ending in {paymentMethod ? paymentMethod.last4 : '' }</span>
                    <button
                      className={"primary narrow alt edit" + ((this.state.showingEdit==='billTo') ? ' hide' : ' show')}
                      onClick={this.showEdit.bind(this, 'billTo')}
                    >Edit</button>
                    {editPayment}
                  </section>

                  <section>
                    <span className="h6 alt">Ship to: </span>
                    <span className={"h5" + ((this.state.showingEdit==='shipTo') ? ' hide' : ' show')}>{member.address.street1}</span>
                    <button
                      className={"primary narrow alt edit" + ((this.state.showingEdit==='shipTo') ? ' hide' : ' show')}
                      onClick={this.showEdit.bind(this, 'shipTo')}
                    >Edit</button>
                    <div className={"toggledContent" + ((this.state.showingEdit==='shipTo') ? ' show' : ' hide')}>
                      <form onSubmit={this.updateShippingAddress} >
                        <FieldsetShippingInfo handleChange = {this.handleShippingChange} address={this.state.address}/>
                        <div className="confirmationActions">
                          <button className="primary">Update</button>
                          <button className="secondary" onClick={this.showEdit.bind(this, '')}>cancel</button>
                        </div>
                      </form>
                    </div>
                  </section>
              </div>
          </div>
      </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    'member': state.member,
    'braintreeError': state.braintreeError,
    'store_can_pick': state.storeData.can_pick,
    'products': state.products,
    'storeTime': state.storeTime,
    'experiment': state.experiment
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ updateMemberShipping, getPaymentMethod, getClientToken }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBox);