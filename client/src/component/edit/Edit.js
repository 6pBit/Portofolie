import React from "react"

export default function Edit() {

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
        currentBilde: "" // får se om det blir en lenke eller ikke.
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
      .then(data =>
        console.log(data)
        //setCurrentData(data)
      )

    }, []) // Kan lastes inn på nytt etter at man har lastet opp ny info.
    
    return (
        <div >

          <div >
            <article>
              <p >Current firstname: </p>
              <p >Current lastname: </p>
              <p >Current tlfNumber: </p>
              <p >Current email: </p>
              <p >Current picture: </p>
            </article>
          </div>

          <form>
            <input 
              type="text" 
              placeholder="Fornavn"
              onChange={handleChange}
              name="fornavn"
              
            />
            <input
              type="text"
              placeholder="Etternavn"
              onChange={handleChange}
              name="etternavn"
            />
            <input
              type="text"
              placeholder="Telefonnummer"
              onChange={handleChange}
              name="tlfNummer"
            />
            <input
              type="email"
              placeholder="Epost"
              onChange={handleChange}
              name="epost"
            />
            <input
              type="text"
              placeholder="Bilde"
              onChange={handleChange}
              name="bilde"
            />

            <input
              type="button"
              onSubmit={handleSubmit}
            />

          </form>

        </div>
    )
}