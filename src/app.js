'use strict';

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const database = require('./database');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  WelcomeIntent() {
    let speech = '';

    if (this.$user.isNew()) {
      speech = 'Hola Bienvenido';
    } else {
      speech = 'Bienvenido de nuevo';
    }

    return this.ask(speech);
  },

  SearchIntent() {
    const actionValue = this.$inputs.action.value; 
    const propertyTypeValue = this.$inputs.propertyType.value; 
    const locationTypeValue = this.$inputs.locationType.value; 
    const cityValue = this.$inputs.city.value; 
    const bedroomCountValue = this.$inputs.bedroomCount.key; 
    const bathroomCountValue = this.$inputs.bathroomCount.key; 
    const poolCountValue = this.$inputs.poolCount.key;

    this.$session.$data.action = actionValue;
    this.$session.$data.propertyType = propertyTypeValue;
    this.$session.$data.locationType = locationTypeValue;
    this.$session.$data.city = cityValue;
    this.$session.$data.bedroomCount = bedroomCountValue;
    this.$session.$data.bathroomCount = bathroomCountValue;
    this.$session.$data.poolCount = poolCountValue;

    const results = database.filter((x) => {
      return x.action === actionValue.toUpperCase()
        && x.propertyType === propertyTypeValue.toLowerCase()
        && x.locationType === locationTypeValue.toLowerCase()
        && x.city.toLowerCase() === cityValue.toLowerCase()
        && x.bedroomCount === Number(bedroomCountValue)
        && x.bathroomCount === Number(bathroomCountValue);
    });

    // const params = {
    //   uri: 'https://www.miendpoint.com/findProperties',
    //   method: 'POST',
    //   header: {
    //     'x-api-key': 'asdf98asdf98as98a98sf9898sa89as899898'
    //   },
    //   body: {
    //     actionValue,
    //     propertyTypeValue,
    //     locationTypeValue,
    //     cityValue,
    //     bedroomCountValue,
    //     bathroomCountValue,
    //     poolCountValue,
    //   },
    // };

    // const results = await rp(params);

    let response = `Acabas de decir que quieres ${actionValue} ${propertyTypeValue} en un ${locationTypeValue} en ${cityValue} con ${bedroomCountValue} cuartos, ${bathroomCountValue} baños, y ${poolCountValue} piscina`;
    response = `${response}. Con esa información he encontrado ${results.length} resultados. Espero haya sido de ayuda. Adios!`;

    return this.tell(response);
  },

});

module.exports = { app };
