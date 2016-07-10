import React, { Component }   from 'react';
import {connect}              from 'react-redux';
import { updateMemberInfo }   from '../../../modules/member';
import { bindActionCreators } from 'redux';
import FieldsetAccountInfo  from '../../elements/FieldsetAccountInfo.jsx';
import AvatarEditor, {loadImage}  from 'react-avatar-editor';
import * as request from 'superagent';
import {get, put} from '../../../svc/utils/net';

let fileUploadStyle = {
  visibility: 'hidden',
  width: '1px',
  height: '1px'
};

export default  class AccountInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      showContent : false,
      member: props.member?
        ({
          first_name:   props.member.first_name,
          last_name:    props.member.last_name,
          email:        props.member.email,
          display_name: props.member.display_name,
          phone:        props.member.phone,
          picture_url:  props.member.picture_url
        }) : ({}),
      editImg:      "http://s3.amazonaws.com/botm-userphotos/userphotos/avatar_default_large.jpeg",
      editingPhoto: false,
      editScale: 1,
      uploadingImg: false,
      dataImg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateAccountInfo = this.updateAccountInfo.bind(this);
    this.uploadPicture = this.uploadPicture.bind(this);
    this.updateScale = this.updateScale.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( this.props.member != nextProps.member )
      this.setState({
        member : {
          first_name: nextProps.member.first_name,
          last_name: nextProps.member.last_name,
          email: nextProps.member.email,
          display_name: nextProps.member.display_name,
          phone: nextProps.member.phone,
          picture_url: nextProps.member.picture_url
        }
      });
  }

  toggleContent(){
    this.setState ({ showContent : !this.state.showContent });
  }

  handleChange( sType, event ) {
    var oUpdate      = this.state.member;
    oUpdate[ sType ] = event.target.value;
    this.setState({ member: oUpdate });
  }

  updateAccountInfo(e){
    e.preventDefault();
    this.props.updateMemberInfo(this.state.member);
    this.toggleContent();
  }

  uploadPicture(e){
    if(e.target.files[0])
    {
      let reader = new FileReader(), userUpload = e.target.files[0], imageResult, aThis = this;
      reader.onload = () =>  { //once the uploaded file is read
        imageResult = reader.result;
        aThis.setState({editingPhoto: true, editImg: imageResult});
      };
      reader.readAsDataURL(userUpload);
    }
  };

  updateScale(e){
    this.setState({editScale: e.target.value});
  }


  handleSave(data) {
    let img = this.refs.avatar.getImage(), presignedURL;
    get('/svc/member/signedurl/' + this.props.member.id).then((res)=>{
      presignedURL = res;
      let file = this.uri2blob(img);
      request
       .put(presignedURL, file)
       .set('Content-Type', 'image/png')
       .end((err, res)=> {
         if (err || res.statusCode !== 200)
          console.log(err);
         else{
           let self = this;
           if(this.props.member.picture_url === "placeholder.jpg") // they never had a profile picture, so save it to db
               get('/svc/member/saveMemberAvatar/' + this.props.member.id);
           self.setState({ uploadingImg: true, dataImg: img}, ()=>{
             window.setTimeout(()=>{
               self.setState({editingPhoto: false, uploadingImg: false});
             }, 2500)
            });
          }
      });
    });
  }

  uri2blob(dataURI) {
    var uriComponents = dataURI.split(',');
    var byteString = atob(uriComponents[1]);
    var mimeString = uriComponents[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    try {
      return new Blob([ab], { type: mimeString });
    } catch (err) {
      window.BlobBuilder = window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder;
      if (err.name == 'TypeError' && window.BlobBuilder) {
        var bb = new BlobBuilder();
        bb.append(ab);
        return bb.getBlob({type: mimeString});
      } else if (err.name == 'InvalidStateError') {
        var b = new Blob([ab], { type: mimeString });
        return b;
      } else {
        alert('Your browser is holding you back! Please upgrade to the latest version to use this feature.');
      }
    }
  }


  render(){
    let { member } = this.props, memberImg;
    if(this.state.dataImg === "")
        memberImg = this.state.member.picture_url === "placeholder.jpg" ? "http://s3.amazonaws.com/botm-userphotos/userphotos/avatar_default_large.jpeg" :
            `https://s3.amazonaws.com/botm-userphotos/userphotos/${this.state.member.picture_url}`;
    else
        memberImg = this.state.dataImg;

    let memberPhoto = (this.state.editingPhoto ?
            (<div>
               <div className="profileImageBorder">
                  <AvatarEditor
                    image={ this.state.editImg }
                    width={ 120 }
                    height={ 120 }
                    border={1}
                    style={{"borderRadius" : "50% !important", "width" : "100% !important", "height" : "100% important"}}
                    color={[219, 219, 233, 1]} // RGBA
                    scale={Number(this.state.editScale)}
                    ref="avatar" />
                </div><input name="scale" type="range" min=".05" max="2" step="0.01" defaultValue="1" onChange={this.updateScale}/>
            </div>)
            :
        <div className="profileImageBorder"><img className="memberPhoto" src={ memberImg } /></div>),
        editLink = (this.state.editingPhoto && this.state.uploadingImg == false ? // editing photo still
              <a className="edit" onClick={this.handleSave}>Save</a>
            : (this.state.editingPhoto && this.state.uploadingImg === true ? //if photo is being uploaded
              <a className="edit">Saving...</a>
            : <a className="edit" onClick={ () => {document.getElementById('upload').click()}}>Edit</a>));

    return(
      <section className="accountInfo">
        <h1 className="sectionHeader">Account Info</h1>
          <div className="profileImageWrapper">
            <h4>Profile Image</h4>
            {memberPhoto}
            <input type="file" id="upload" name="upload" accept="image/*" onChange={this.uploadPicture} style={fileUploadStyle}/>
            {editLink}
          </div>
          <div className={"content toggledContent" + ((this.state.showContent) ? ' hide' : ' show')}>
            <table className="dataTable">
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{member.first_name + " " + member.last_name}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{member.email}</td>
                </tr>
                <tr>
                  <td>Username:</td>
                  <td>{member.display_name}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>{member.phone}</td>
                </tr>
                <tr>
                  <td>Password:</td>
                  <td>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</td>
                </tr>
              </tbody>
            </table>
            <button className="primary narrow" onClick={this.toggleContent.bind(this)} >Edit</button>
          </div>
          <div className={"content toggledContent" + ((this.state.showContent) ? ' show' : ' hide')}>
            <form onSubmit={this.updateAccountInfo} >
              <FieldsetAccountInfo handleChange={this.handleChange} member={this.state.member} />
              <div className="confirmationActions">
                <button className="primary">Update</button>
                <a className="button secondary" onClick={this.toggleContent.bind(this)}>cancel</a>
              </div>
            </form>
          </div>
      </section>
    );
  }
}

function mapStateToProps(state){
    return { 'member': state.member };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ updateMemberInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);