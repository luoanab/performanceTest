function generateData() {
    var array = [];
    var length = $("#numberOfRows").val();
    var adjectives = ["tall", "short", "bold", "young", "old", "ugly", "pretty", "wild", "fluffy", "fat", "skinny"];
    var colors = ["black", "pink", "red", "brown", "grey", "green", "white"];
    var substantives = ["cat", "dog", "pony", "unicorn", "fairy", "dragon"];
    var adjectiveIndex, colorIndex, substantiveIndex, text;
    
    for (var i = 0; i < length; i++) {
        adjectiveIndex = Math.floor(Math.random() * (adjectives.length));
        colorIndex = Math.floor(Math.random() * (colors.length));
        substantiveIndex = Math.floor(Math.random() * (substantives.length));
        text = i + " - ";
        text += [adjectives[adjectiveIndex], colors[colorIndex], substantives[substantiveIndex]].join(" ");
        array.push(text);
    }
    
    return array;
}

function generateRandomNumber () {
    //generate a number between 1 and 10
    return Math.floor(Math.random() * 10 + 1);
}

var TableRow = React.createClass({
    
    getInitialState: function () {
        return {
            rendersCounter: 1,
            randomNumber: 10,
            backgroundColor: "#d6f58e",
            textColor: "#ccc"
        };
    },

    componentWillReceiveProps: function () {
        var number = generateRandomNumber();
        var color = "black";
        var textColor = "#fff";
        
        switch (number) {
            case 1:
            case 2:
            case 3:
                color = "#d6f58e";
                textColor = "#777";
                break;
            case 4:
            case 5:
            case 6:
                color = "#82b21e";
                break;
            case 7:
            case 8:
            case 9:
                color = "#5c8a03";
                break;
            default:
                color = "#264301";  
                break; 
        }

        this.setState({
            randomNumber: number,
            backgroundColor: color,
            textColor: textColor
        });
    },

    // We only want to re-render the component when the props is different. (Only when updated by the parent component).
    shouldComponentUpdate: function (nextProps, nextState) {
        return (nextProps.counter != this.props.counter);
    },
    
    render: function () {
        var tooltipText = "updated " + this.state.rendersCounter + " times";
        var text = this.props.text;
        var style = {
            backgroundColor: this.state.backgroundColor,
            color: this.state.textColor,
            textAlign: "center",
            padding: "15px",
            borderRadius: "50%"
        };

        return (<tr>
            <td>
                <TextWithTooltip tooltip={tooltipText} text={text}/>
            </td>
            <td>{this.state.rendersCounter}</td>
            <td>{this.props.counter}</td>
            <td>
                <p style={style}>
                    {this.state.randomNumber}
                </p>
            </td>
        </tr>
        );
    },

    // Component did update. Increment the row's render counter.
    componentDidUpdate: function (){
        this.setState({rendersCounter: this.state.rendersCounter +1});
    }
    
});

var TextWithTooltip = React.createClass({
    
    getInitialState: function () {
        return {
            hover: false    
        };
    },
    
    handleHoverIn: function (e) {
        this.setState({hover: true});
    },
    
    handleHoverOut: function (e) {
        this.setState({hover: false});    
    },
    
    render: function () {
        var tooltip;
        var style = {
            padding: "15px"
        };
        
        if (this.state.hover) {
            tooltip = <p className="tooltipBox">{this.props.tooltip}</p>;
            style.backgroundColor = "orange";
            style.color = "#fff";
        }
        
        return (
            <p className="tooltipTrigger" style={style} onMouseEnter={this.handleHoverIn} onMouseLeave={this.handleHoverOut}>
                {this.props.text}
                {tooltip}
            </p>);
    }
});

var Table = React.createClass({
    
    getInitialState: function () {
        return {
            tableRows: generateData(),
            updatesCounter: 0,
            updates: $("#updates").val(),
            timeout: $("#timeout").val(),
            timestamp: Date.now(),
            updateTimestamp: Date.now(),
            rowUpdateTime:0,
            completed: 0
        };
    },

    setTimer: function () {
        this.setState({
            updatesCounter: this.state.updatesCounter + 1,
            rowUpdateTime: Date.now() - this.state.updateTimestamp,
            updateTimestamp: Date.now()
        });
        
        if (this.state.updatesCounter < this.state.updates) {
            setTimeout(this.setTimer, this.state.timeout);
        } else {
            this.setState({
                timestamp: Date.now() - this.state.timestamp,
                completed: 1           
            });
        }
    },

    componentDidMount: function () {
        this.setTimer();
    },

    render: function () {
        var rows = [];
        
        this.state.tableRows.forEach(function(item, index) {
          rows.push(<TableRow key={index} text={item} counter={this.state.updatesCounter}/>);
        }.bind(this));
        
        return (
            <div>
                <div>Row update time(ms): {this.state.rowUpdateTime}</div>
                <div className={this.state.completed ? "" : "hidden"}>Total loading time(ms): {this.state.timestamp}</div>
                <table className="table">
                    <tr>
                        <th>Random text</th>
                        <th>Row Updates Counter</th>
                        <th>Total Updates Counter</th>
                        <th>Random Number</th>
                    </tr>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});

$("#run-react").on("click", function(){
    React.render(<Table/>, document.getElementById('react'));
})