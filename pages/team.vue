<template>
  <b-container class="pt-4">
    <b-row class="center">
      <b-card no-body class="overflow-hidden" style="max-width: 540px;">
        <b-row no-gutters>
          <b-col md="6">
            <b-card-img
              src="https://picsum.photos/400/400/?image=20"
              alt="Image"
              class="rounded-0"
            ></b-card-img>
          </b-col>
          <b-col md="6">
            <b-card-body title="Colmena Labs">
              <b-card-text>
                Lorem fistrum pecador no te digo trigo por no llamarte Rodrigor
                de la pradera a wan se calle ustée a wan sexuarl ese hombree
                mamaar jarl. Amatomaa mamaar la caidita sexuarl apetecan ese
                pedazo de.
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-row>
    <b-row class="center pt-4">
      <b-card title="Background del equipo"
        >Lorem fistrum de la pradera de la pradera me cago en tus muelas ese
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
        calle ustée pecador. Qué dise usteer apetecan pupita torpedo.</b-card
      >
    </b-row>
    <b-row class="pt-4">
      <b-card-group deck>
        <b-col
          v-for="member in members"
          :key="member.name"
          sm="12"
          md="6"
          lg="3"
          class="member"
        >
          <b-card
            :title="member.name"
            :img-src="member.picture"
            img-alt="Image"
            img-top
          >
            <b-card-text>
              {{ member.description }}
            </b-card-text>
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
          name: "member1",
          picture: "https://picsum.photos/300/300/?image=41",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "member2",
          picture: "https://picsum.photos/300/300/?image=41",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "member3",
          picture: "https://picsum.photos/300/300/?image=41",
          description:
            "Lorem fistrum no te digo trigo por no llamarte Rodrigor diodenoo te voy a borrar el cerito llevame al sircoo está la cosa muy malar. Va usté muy cargadoo al ataquerl pecador pupita sexuarl ese hombree no puedor diodeno fistro."
        },
        {
          name: "member4",
          picture: "https://picsum.photos/300/300/?image=41",
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
