import {defineField, defineType} from 'sanity'

export const selskaberFormSectionType = defineType({
  name: 'selskaberFormSection',
  title: 'Selskaber Kontaktformular',
  type: 'object',
  groups: [
    {name: 'content', title: 'Indhold', default: true},
    {name: 'fields', title: 'Feltetiketter'},
    {name: 'placeholders', title: 'Pladsholdere'},
    {name: 'validation', title: 'Valideringsbeskeder'},
    {name: 'states', title: 'Knap & tilstande'},
    {name: 'occasions', title: 'Anledninger'},
  ],
  fields: [
    // Content
    defineField({name: 'formHeading', title: 'Overskrift', type: 'string', group: 'content'}),
    defineField({name: 'formDescription', title: 'Beskrivelse', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'formPhone', title: 'Telefon', type: 'string', group: 'content'}),
    defineField({name: 'formEmail', title: 'Email', type: 'string', group: 'content'}),

    // Occasion dropdown options
    defineField({
      name: 'occasionOptions',
      title: 'Valg i "Anledning"-dropdown',
      description: 'Listen af anledninger som gæster kan vælge mellem. Fallback: Bryllup, Barnedåb, Fødselsdag, Firmafest, Konfirmation, Jubilæum, Andet.',
      type: 'array',
      of: [{type: 'string'}],
      group: 'occasions',
    }),

    // Field labels
    defineField({name: 'nameLabel', title: 'Navn-etiket', type: 'string', initialValue: 'Navn *', group: 'fields'}),
    defineField({name: 'emailLabel', title: 'Email-etiket', type: 'string', initialValue: 'Email *', group: 'fields'}),
    defineField({name: 'occasionLabel', title: 'Anledning-etiket', type: 'string', initialValue: 'Anledning', group: 'fields'}),
    defineField({name: 'guestCountLabel', title: 'Antal gæster-etiket', type: 'string', initialValue: 'Antal gæster', group: 'fields'}),
    defineField({name: 'dateLabel', title: 'Ønsket dato-etiket', type: 'string', initialValue: 'Ønsket dato', group: 'fields'}),
    defineField({name: 'messageLabel', title: 'Besked-etiket', type: 'string', initialValue: 'Besked *', group: 'fields'}),

    // Placeholders
    defineField({name: 'namePlaceholder', title: 'Navn pladsholder', type: 'string', initialValue: 'Jens Jensen', group: 'placeholders'}),
    defineField({name: 'emailPlaceholder', title: 'Email pladsholder', type: 'string', initialValue: 'jens@eksempel.dk', group: 'placeholders'}),
    defineField({name: 'occasionPlaceholder', title: 'Anledning pladsholder', type: 'string', initialValue: 'Vælg anledning', group: 'placeholders'}),
    defineField({name: 'guestCountPlaceholder', title: 'Antal gæster pladsholder', type: 'string', initialValue: 'f.eks. 40', group: 'placeholders'}),
    defineField({name: 'messagePlaceholder', title: 'Besked pladsholder', type: 'text', rows: 2, initialValue: 'Fortæl os om jeres arrangement, ønsker til menu, særlige behov osv.', group: 'placeholders'}),

    // Validation
    defineField({name: 'nameRequiredMessage', title: 'Navn påkrævet-besked', type: 'string', initialValue: 'Navn er påkrævet', group: 'validation'}),
    defineField({name: 'emailRequiredMessage', title: 'Email påkrævet-besked', type: 'string', initialValue: 'Email er påkrævet', group: 'validation'}),
    defineField({name: 'emailInvalidMessage', title: 'Email ugyldig-besked', type: 'string', initialValue: 'Indtast en gyldig emailadresse', group: 'validation'}),
    defineField({name: 'messageRequiredMessage', title: 'Besked påkrævet-besked', type: 'string', initialValue: 'Besked er påkrævet', group: 'validation'}),
    defineField({name: 'genericErrorMessage', title: 'Generisk fejl-besked', type: 'string', initialValue: 'Noget gik galt.', group: 'validation'}),
    defineField({name: 'networkErrorMessage', title: 'Netværksfejl-besked', type: 'string', initialValue: 'Netværksfejl. Prøv venligst igen.', group: 'validation'}),

    // Submit & states
    defineField({name: 'submitLabel', title: 'Send-knap tekst', type: 'string', initialValue: 'Send forespørgsel', group: 'states'}),
    defineField({name: 'submittingLabel', title: 'Sender…-tekst', type: 'string', initialValue: 'Sender…', group: 'states'}),
    defineField({name: 'successEyebrow', title: 'Succes øjenbryn', type: 'string', initialValue: 'Tak for din forespørgsel', group: 'states'}),
    defineField({name: 'successHeading', title: 'Succes overskrift', type: 'string', initialValue: 'Vi vender tilbage hurtigst muligt', group: 'states'}),
    defineField({name: 'successBody', title: 'Succes brødtekst', type: 'text', rows: 2, initialValue: 'Du hører fra os inden for et par hverdage med et uforpligtende forslag.', group: 'states'}),
  ],
  preview: {
    select: {title: 'formHeading'},
    prepare({title}) {
      return {title: `Selskaber Form: ${title || 'Uden overskrift'}`}
    },
  },
})
