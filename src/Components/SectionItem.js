import React, {Component} from 'react';

class SectionItem extends Component {
    
    render() {
        return (
            <div className="SectionItem">
                {this.props.section.position} ->
                {this.props.section.name} 
                {this.props.section.duration} min
                {this.props.section.description}
            </div>
        )   
    }
}
export default SectionItem;