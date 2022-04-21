import React from "react"
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const USER_ID = process.env.USER_ID

export default function Edit(props) {

    const isMounted = React.useRef(false)
    const idHelper = React.useRef("")

    const [formData, setFormData] = React.useState({
      fornavn: "",
      etternavn: "",
      tlfNummer: "",
      epost: "",
      bildelenke: "",
      bildeAltTekst: ""
       // får se om det blir en lenke eller ikke.
    })

    const [oldData, setOldData] = React.useState({
      fornavn: "",
      etternavn: "",
      tlfNummer: "",
      epost: "",
      bildelenke: "",
      bildeAltTekst: ""
       // får se om det blir en lenke eller ikke.
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

        setOldData( {
          ...formData
        })

    }
    
    React.useEffect(() => {
      //console.log(USER_ID)
      fetch(`/user/6254341b8acb5f014cfe0800`) 
      .then(response => response.json()) 
      .then(data => (
        console.log(data + " type objekt useEffect som getter bruker Edit.js"),
        idHelper.current = data._id,
        setOldData( {
          fornavn: data.fornavn,
          etternavn: data.etternavn,
          tlfNummer: data.tlfNummer,
          epost: data.epost,
          bildelenke: data.bildelenke, 
          bildeAltTekst: data.bildeAltTekst
        }, () => console.log(" Setstate kjørt Edit.js"))
        )
      )
    }, []) // Kan lastes inn på nytt etter at man har lastet opp ny info.

    React.useEffect(() => {
      if(isMounted.current) {
        const requestNewUser = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            oldData
          )
        }
        console.log(idHelper.current + " her er _id  fra finalFormData oppdaterer bruker Edit.js")
        fetch(`/user/${idHelper.current}`, requestNewUser )
          .then( response => {
            console.log("fetch resultat "+ response.json())
            //setCurrentData(JSON.stringify(response.json()))
            
          })
      } else {
        isMounted.current = true
      }
    }, [oldData])

    return (
        <div className="container">

          <div className="current_info">
            <article>
              <p>Current firstname: {oldData.fornavn}</p>
              <p>Current lastname: {oldData.etternavn}</p>
              <p>Current tlfNumber: {oldData.tlfNummer}</p>
              <p>Current email: {oldData.epost}</p>
              <img src={oldData.bildelenke}
                alt={oldData.bildeAltTekst}/>
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
              placeholder="Bildelenke"
              onChange={handleChange}
              name="bildelenke"
              value={formData.bildelenke}
            />
            <input
              type="text"
              placeholder="Bilde alt tekst"
              onChange={handleChange}
              name="bildeAltTekst"
              value={formData.bildeAltTekst}
            />

            <input
              type="button"
              text="Submit"
              onClick={handleSubmit}
            />

          </form>

        </div>
    )
}

/*
fornavn: finalFormData.fornavn,
            etternavn: finalFormData.etternavn,
            tlfNummer: finalFormData.tlfNummer,
            epost: finalFormData.epost,
            bildelenke: finalFormData.bildelenke,
            bildeAltTekst: finalFormData.bildeAltTekst
            */