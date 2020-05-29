<template>
  <b-container class="pt-4">
    <b-row class="center pt-4">
      <b-card title="PolkaStats Team">
        Lorem fistrum de la pradera de la pradera me cago en tus muelas ese
        hombree pupita benemeritaar. Papaar papaar amatomaa qué dise usteer
        apetecan por la gloria de mi madre ese que llega. A peich llevame al
        sircoo quietooor se calle ustée no te digo trigo por no llamarte
        Rodrigor jarl de la pradera llevame al sircoo. Torpedo te va a hasé
        pupitaa quietooor va usté muy cargadoo. Al ataquerl al ataquerl me cago
        en tus muelas amatomaa papaar papaar. Qué dise usteer jarl diodenoo al
        ataquerl ese que llega la caidita pecador tiene musho peligro se calle
        ustée mamaar hasta luego Lucas. Fistro a peich hasta luego Lucas papaar
        papaar. Condemor amatomaa tiene musho peligro tiene musho peligro
        pecador caballo blanco caballo negroorl pupita a gramenawer amatomaa te
        voy a borrar el cerito. Diodenoo pecador se calle ustée a wan torpedo
        tiene musho peligro no te digo trigo por no llamarte Rodrigor. Te voy a
        borrar el cerito al ataquerl caballo blanco caballo negroorl va usté muy
        cargadoo apetecan va usté muy cargadoo ese que llega te va a hasé
        pupitaa. Te voy a borrar el cerito hasta luego Lucas jarl a gramenawer
        benemeritaar ahorarr ese pedazo de no te digo trigo por no llamarte
        Rodrigor. Hasta luego Lucas apetecan qué dise usteer a peich tiene musho
        peligro diodeno la caidita. Al ataquerl se calle ustée de la pradera se
        calle ustée pecador. Qué dise usteer apetecan pupita torpedo.
      </b-card>
    </b-row>
    <b-row class="pt-4">
      <b-card-group deck>
        <b-col
          v-for="member in members"
          :key="member.name"
          sm="12"
          md="6"
          lg="3"
          class="member mb-3 pb-3"
        >
          <b-card
            :title="member.name"
            :img-src="member.picture"
            img-alt="Image"
            img-top
          >
            {{ member.description }}
          </b-card>
        </b-col>
      </b-card-group>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data: function() {
    return {
      members: [
        {
          name: "Mario",
          picture: "https://dragonstake.io/img/dragonstake/team/Mario.jpg",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "Fredy",
          picture: "https://dragonstake.io/img/dragonstake/team/Fredy.jpg",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "Javi",
          picture: "https://picsum.photos/300/300/?image=41",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "Diego",
          picture: "https://picsum.photos/300/300/?image=41",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "Wimel",
          picture: "https://dragonstake.io/img/dragonstake/team/Wimel.png",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "Ana",
          picture: "https://dragonstake.io/img/dragonstake/team/Ana.jpg",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        }
      ]
    };
  }
};
</script>

<style scoped>
.center {
  justify-content: center;
}
.member {
  margin: 0;
  padding: 0;
}

@media (max-width: 991px) {
  .member {
    padding-bottom: 1.5rem;
  }
}

@media (max-width: 575px) {
  .member {
    padding: 1rem;
  }
}
</style>
