/*
  This file uses TheMovieDB API's discover function
  to show current trending / popular movies.
*/


import React, {Component} from 'react';


export class Discover extends Component {

  render() {

    let discoveredMovies = this.props.discoveredMovies;
    let discoveredFetched = this.props.discoveredFetched;

    return(
      <div id="Discover">

          {/*Show the click button if the API hasn't fetched the data yet*/}
          {discoveredFetched === false &&
            <div id="ShowDiscoverBtn">
              <br />
              <button
                className="btn btn-primary"
                onClick={this.props.onDiscoverClick}
              >
              Discover Popular Movies
              </button>
            </div>
          }

          {/*This just displays a flat list. Would be nice
            to add a button to show more details about that
            movie. */}
          <table className="table" id="DiscoverTable">
            <tbody>
            {discoveredFetched &&
              discoveredMovies.results.map((movie, index) =>
              (
                      <tr key={index}>
                        <td>{(index+1)}</td>
                        <td>{movie.title}</td>
                        <td>{Math.round(movie.popularity)}</td>
                      </tr>


              )

            )}
          </tbody>
        </table>



      </div>
    );

  }


}
/*
{discoveredMovies.results.map((movie, index) =>
  (
    <div>
      <table>
        <tbody>
          <tr>
            <td key={index}>{movie.title}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )

)}
*/
