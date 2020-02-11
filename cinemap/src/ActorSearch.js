import React, {Component} from 'react';
import {CultHeroes} from './CultHeroes';
import hal from './images/hal.jpg';

export class ActorSearch extends Component {


  getAge(dateString) {
    let birthDate = new Date(dateString);
    let currentDate = new Date( Date.now() );

    //an *appalling* googled hack to calculate the age by
    //dividing it by the number of seconds in
    //the year. other methods have proven
    //surprisingly difficult - FIX at some point!
    let age = Math.round( (currentDate - birthDate) / (31557600000) );
    return age;
  }

  render() {

    let showCultHeroes = this.props.showCultHeroes;
    const onShowCultClick = this.props.onShowCultClick;
    const onShowCultBackClick = this.props.onShowCultBackClick;

    let actorInfoArray = this.props.actorInfoArray;
    let actFetched = this.props.actFetched;
    const actorDetails = this.props.actorDetails;
    let actDetFetched = this.props.actDetFetched;
    let showActDetails = this.props.showActDetails;

    const handleActorSearch = this.props.handleActorSearch;
    const onActorSearchClick  = this.props.onActorSearchClick;
    const onActorDetailClick = this.props.onActorDetailClick;
    const onActorDetailBackClick = this.props.onActorDetailBackClick;
    const onActorNextClick = this.props.onActorNextClick;
    const onActorPrevClick = this.props.onActorPrevClick;
    const onActorBackClick = this.props.onActorBackClick;

    let searchValid = this.props.searchValid;

    return(
      <div id="ActorSearch">
      <br />
      { showCultHeroes === false &&
        <div id="ActorSearchInput">
        <input

          type="text"
          placeholder="Type here"
          id="ActorSearchForm"
          onChange={handleActorSearch}
        >
        </input>
        <button
          className="btn btn-primary"
          type="submit"
          id="ActorSearchClick"
          onClick={onActorSearchClick}
          disabled={!searchValid}
        >
          Search for Actor
        </button>

          {actFetched === false &&
            <div id="CultHeroesClick">
              <br />
              <button type="button" className="btn btn-secondary" onClick={onShowCultClick}>Cult Heroes</button>
            </div>
          }
        </div>

      }



        {/*showing the general actor search array*/}
        {	actorInfoArray.success !== false
          && actFetched===true
          && showCultHeroes === false &&

          <div id="ActorSearch">


          <br />
          {/*stop attempted render if there is nothing
          to show*/}
          { actorInfoArray.total_results !== 0 && actFetched === true &&
            showActDetails === false &&

            <div>

              <table id="ActorSearchResults" className="table table-hover table-sm">
                <tbody>
                {actorInfoArray.results.map((actor, index) =>
                  /*this api returns ALL people related to the movie,
                    so need to filter out non-actors*/

                  (actor.known_for_department === "Acting") ?
                  (
                  <tr key = {index}>
                      <td>
                        <button
                          className="btn btn-link"
                          onClick={() => onActorDetailClick(actor.id)}

                        >
                          <strong style={{color: "#f5dea3"}}>{actor.name}</strong>
                        </button>
                      </td>
                      <td>
                        {actor.known_for.map((movie, index) => (
                            <div key={index}>
                              {movie.title}
                            </div>

                          )
                        )

                        }
                        </td>

                    </tr>

                    )

                  /*return an empty invisible row
                    if the person is not an actor*/
                  : <tr key = {index}></tr>)}

                  </tbody>
                </table>

                {/*only show next button if necessary.
                  this works by calling API for next page*/}
                { this.props.actSearchMaxPages > 1 && this.props.currentActorPage < this.props.actSearchMaxPages &&

                  <div>
                    <button
                      type="button" className="btn btn-secondary"
                      onClick={onActorNextClick}
                    >
                      Next &#8250;
                    </button>
                  </div>

                }

                  Page {this.props.currentActorPage}/{this.props.actSearchMaxPages}
                  <br />

                {/*only show previous button after first page*/}
                { this.props.currentActorPage > 1 &&
                  <div>
                    <button
                      type="button" className="btn btn-secondary"
                      onClick={onActorPrevClick}
                    >
                      &#8249; Previous
                    </button>
                  </div>

                }

                <button type="button" className="btn btn-secondary"
                  onClick={onActorBackClick}>Back</button>


              </div>

            }

            {/*show this bit if extra details are requested*/}
            { showActDetails === true && actDetFetched===true && showCultHeroes===false &&

              <div id="ActorDetails">
                <h2>{actorDetails.name}</h2>



                <table id="ActorDetailsResults" className="table table-sm">
                  <tbody>
                    <tr>
                      <td rowSpan="4">

                      {/*only display images if they were returned with api call*/}
                      { actorDetails.images.profiles.length > 0 ?
                        (
                          <img
                            src={'https://image.tmdb.org/t/p/w185/'+actorDetails.images.profiles[0].file_path}
                            alt={"Picture of"+actorDetails.name}
                            style={{maxHeight: "250px"}}
                          >
                          </img>
                        )
                        : "No image :("
                      }
                      </td>
                    </tr>
                    <tr>
                      {/*convert ISO datestring in an overly convoluted manner*/}
                      <td>Date of Birth:&nbsp;{actorDetails.birthday !== null ? (actorDetails.birthday.split('-').reverse().join('/')) : "Unknown"  }</td>
                    </tr>
                      <tr>
                      {/*conditionally show the age or the
                      date of death, depending on how
                      fresh the actor is.
                      will not work correctly for vampire
                      or zombie actors.*/}
                      {actorDetails.deathday===null &&
                        <td>Age: {this.getAge(actorDetails.birthday)} </td>
                      }
                      {actorDetails.deathday !== null &&
                        <td>Died: {actorDetails.deathday.split('-').reverse().join('/')}</td>
                      }
                      </tr>
                    <tr>
                      <td colSpan="2">Born in {actorDetails.place_of_birth}</td>
                    </tr>
                  </tbody>
                </table>

                <p>{actorDetails.biography}</p>

                <button className="btn btn-info" onClick={onActorDetailBackClick}

                >
                  Back
                </button>
              </div>
            }

            {/*handle a lack of results, for example an unlisted
            actor or typo. this api is a little fussy about
            having almost perfect names and apparently
            there are no plans to make its search more "fuzzy", so...*/}
          { actorInfoArray.total_results === 0 &&
            <div id="ActorInfoNoResults">
              <p>I'm afraid I can't do that, Dave.</p>

              <img src={hal} alt="HAL 9000 from 2001: A Space Odyssey" />
              <br /><br />
              <p><em>(Try searching again.)</em></p>

              <button type="button" className="btn btn-info"
                onClick={onActorBackClick}>Back</button>

            </div>
          }

          </div>
        }

        <br />


        {/*an extra feature - a cult heroes list & search*/}
        { showCultHeroes === true &&
          <div id="ShowCultHeroes">
            <CultHeroes onShowCultClick={onShowCultClick}
              onActorDetailClick={onActorDetailClick}
            />

    			<br />
    			<button type="button" className="btn btn-info" onClick={onShowCultBackClick}>Back</button>
          </div>
        }

        <br />

        {/*legally required disclaimer*/}
        <br />
        <footer id="Disclaimer">
          Search APIs kindly provided by <a href="http://www.omdbapi.com/">The Open Movie Database</a>
          &nbsp;and <a href="https://www.themoviedb.org/documentation/api">
          The Movie Database API</a>
        </footer>


      </div>
    );

  }

}
