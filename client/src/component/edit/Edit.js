import React from "react"

export default function Edit(props) {

    const [formData, setFormData] = React.useState({
      fornavn: "",
      etternavn: "",
      tlfNummer: "",
      epost: "",
      bilde: "" // får se om det blir en lenke eller ikke.
    })

    const [currentData, setCurrentData] = React.useState({
        currentFornavn: "",
        currentEtternavn: "",
        currentTlfNummer: "",
        currentEpost: "",
        currentBilde: {
          currentBildelenke: "",
          currentBilde_alt_tekst: ""
        } // får se om det blir en lenke eller ikke.
    })

    function handleChange(event) {
      console.log(event.target.value)

      setFormData(prevFormData => {
        return {
          ...prevFormData,
          [event.target.name]: event.target.value
        }
      })

    }

    function handleSubmit(event){
        event.preventDefault();
    }

    const test_fornavn = "test_bruker_fornavn"
    
    React.useEffect(() => {
      console.log("Henta currentUser")
      fetch(`/user/test_bruker_fornavn`) // polyfill om man bruker ${test_fornavn}
      .then(response => response.json()) // feilen kommer om man bruker res eller response. Polyfill shit
      .then(data => (
        console.log(data.fornavn),
        setCurrentData( {
          currentFornavn: data.fornavn,
          currentEtternavn: data.etternavn,
          currentTlfNummer: data.tlfnummer,
          currentEpost: data.epost,
          currentBilde: {
            currentBildelenke: data.bilde.bildelenke,
            currentBildeAltTekst: data.bilde.bilde_alt_tekst
          }
        })
        )
      )

    }, []) // Kan lastes inn på nytt etter at man har lastet opp ny info.

    return (
        <div className="container">

          <div className="current_info">
            <article>
              <p>Current firstname: {currentData.currentFornavn}</p>
              <p>Current lastname: {currentData.currentEtternavn}</p>
              <p>Current tlfNumber: {currentData.currentTlfNummer}</p>
              <p>Current email: {currentData.currentEpost}</p>
              <p>Current picture: {currentData.currentBilde.currentBildelenke +
                                " " + currentData.currentBilde.currentBildeAltTekst}
              </p>
            </article>
          </div>

          <form>
            <input 
              type="text" 
              placeholder="Fornavn"
              onChange={handleChange}
              name="fornavn"
              value={formData.fornavn}
            />
            <input
              type="text"
              placeholder="Etternavn"
              onChange={handleChange}
              name="etternavn"
              value={formData.etternavn}
            />
            <input
              type="text"
              placeholder="Telefonnummer"
              onChange={handleChange}
              name="tlfNummer"
              value={formData.tlfNummer}
            />
            <input
              type="email"
              placeholder="Epost"
              onChange={handleChange}
              name="epost"
              value={formData.epost}
            />
            <input
              type="text"
              placeholder="Bilde"
              onChange={handleChange}
              name="bilde"
              value={formData.bilde}
            />

            <input
              type="button"
              onSubmit={handleSubmit}
            />

          </form>

        </div>
    )
}