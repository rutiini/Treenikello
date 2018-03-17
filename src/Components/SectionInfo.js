import React from 'react';

const SectionInfo = (props) => {
  
  let sectionColor = "";
  let sectionName = "";
  let sectionDescription = "";
  
  if(props.activeSection != null){
    sectionColor = props.activeSection.color;
    sectionName = props.activeSection.name;
    sectionDescription = props.activeSection.description;
  }else{
    sectionColor = "";
    sectionName = "";
    sectionDescription = "";
  }
  
  return (
    <div className="SectionInfoBox" style={{background: sectionColor}}>
    {sectionName}<br/>
    <span className="SectionInfoDescription">{sectionDescription}</span>
    </div>
  )
}

export default SectionInfo;