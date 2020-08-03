import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'tachyons'

function Square(props){
      return (
        <button className={"square square"+props.id} onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {   
    
    renderSquare(i) {
      return <Square
      id={i} 
      value={this.props.squares[i]} 
   //this takes the function we passed and just passes it on giving it the correct value of i
      onClick={()=>this.props.onClick(i)}
       />;
    }
  
    render() {      
       
      return (
        <div>

          {/* this creates the 9 squares */}

          {/* You can't use a for loop to loop through the calls because
          we are using flex box to make each row 3 so each pair of three
          needs their own div */}

          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }



// Class Game

  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state={
        history:[{
          squares:Array(9).fill(null)
        }],
        xIsNext:true,
        stepNumber:0
      };
    }


    //This is the background from naker.io a webGL platform
    componentDidMount() {
      window.nakerback.render({
        container: document.getElementById('container'),
        particle:{
            direction1:{x:0,y:0,z:0},
            direction2:{x:0,y:0,z:0},
            power:0,
            texture:"https://d2uret4ukwmuoe.cloudfront.net/particle/sparks.png",
            number:819,
            colorStart:[255,255,255,1],
            colorEnd:[255,255,255,1],
            sizeStart:0.18,
            sizeEnd:0.36,
        },
        environment:{
            sensitivity:0.96,
            colorStart:[0,0,0,1],
            colorEnd:[0,0,255,1]
        }
      });
  }
  

    handleClick(i){
      //The new history is based on the stepNumber, note that .slice(beg,end) end is exclusive hence the +1
      const history=this.state.history.slice(0,this.state.stepNumber+1)
      const currentObject = history[history.length-1]
      const currentArray = currentObject.squares.slice()

      //Checks for a winner, if a winner stop the game
      if(calculateWinner(currentArray) || currentArray[i]){
        return null
      }

          currentArray[i] = this.state.xIsNext ? 'X' : 'O'
          this.setState({
            history:history.concat([{
              squares:currentArray
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber:history.length
          })
    }

      //Jump to a different state in the board
      jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext: (step%2)===0
      })

      }


    render() {
      const history=this.state.history
      const currentObject=history[this.state.stepNumber]
      const currentArray=currentObject.squares
      const Winner = calculateWinner(currentArray);

     


      //Map the Moves into an ordered list
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
          {/* Note here we pass the method jumpTo the value move */}
            <button onClick={() =>this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });



        //Set State
      let status='';
      if(Winner){
        status = 'The Winner is '+ Winner
      }else{
        status='Next player: ' + (this.state.xIsNext ? 'X' : 'O'); 
      }

      return (

        <div className="containerOfGame">
        <div className="game">
          <div className="game-board">
            {/* We pass the currentArray which has all the current values of the current state of the board */}
            {/* We pass a function that takes input i and calls the method handleClick passing the value i*/}
            <Board squares={currentArray} onClick={(i)=>this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
           <ol>{moves}</ol>
          </div>
        </div>
        </div>
      );
    }
  }

  
  //This function returns X or O depending on the winner
  function calculateWinner(square){
    
    const winCombos=[
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ]
    for (const combo of winCombos){
      const [a,b,c]=combo
     
      if(square[a]&&square[a]===square[b]&&square[a]===square[c]){
        return square[a]
      }
    }
    return null
  }
  
  

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  
  
