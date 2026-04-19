import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const contactSectionType = defineType({
  name: 'contactSection',
  title: 'Kontaktsektion',
  type: 'object',
  icon: EnvelopeIcon,
  description: 'Kontaktoplysninger og kontaktformular side om side.',
  groups: [
    {name: 'content', title: 'Indhold', default: true},
    {name: 'fields', title: 'Feltetiketter'},
    {name: 'placeholders', title: 'Pladsholdere'},
    {name: 'validation', title: 'Valideringsbeskeder'},
    {name: 'states', title: 'Knap & tilstande'},
  ],
  fields: [
    // Content
    defineField({name: 'eyebrow', title: 'Øjenbryn (kursiv tekst over overskriften)', type: 'string', initialValue: 'Kom i kontakt', group: 'content'}),
    defineField({name: 'heading', title: 'Overskrift', type: 'string', initialValue: 'Kontakt Os', group: 'content'}),
    defineField({name: 'phone', title: 'Telefonnummer', type: 'string', initialValue: '+45 33 31 17 51', group: 'content'}),
    defineField({name: 'email', title: 'Email', type: 'string', initialValue: 'info@allegade10.dk', group: 'content'}),
    defineField({name: 'address', title: 'Adresse', type: 'string', initialValue: 'Allégade 10, 2000 Frederiksberg', group: 'content'}),
    defineField({
      name: 'notificationEmail',
      title: 'Notifikations-email',
      description: 'Denne adresse modtager indsendte kontaktformularer.',
      type: 'string',
      group: 'content',
    }),

    // Field labels
    defineField({name: 'nameLabel', title: 'Navn-etiket', type: 'string', initialValue: 'Navn *', group: 'fields'}),
    defineField({name: 'emailLabel', title: 'Email-etiket', type: 'string', initialValue: 'Email *', group: 'fields'}),
    defineField({name: 'messageLabel', title: 'Besked-etiket', type: 'string', initialValue: 'Besked *', group: 'fields'}),

    // Placeholders
    defineField({name: 'namePlaceholder', title: 'Navn pladsholder', type: 'string', initialValue: 'Jens Jensen', group: 'placeholders'}),
    defineField({name: 'emailPlaceholder', title: 'Email pladsholder', type: 'string', initialValue: 'jens@eksempel.dk', group: 'placeholders'}),
    defineField({name: 'messagePlaceholder', title: 'Besked pladsholder', type: 'string', initialValue: 'Skriv din besked her…', group: 'placeholders'}),

    // Validation
    defineField({name: 'nameRequiredMessage', title: 'Navn påkrævet-besked', type: 'string', initialValue: 'Navn er påkrævet', group: 'validation'}),
    defineField({name: 'emailRequiredMessage', title: 'Email påkrævet-besked', type: 'string', initialValue: 'Email er påkrævet', group: 'validation'}),
    defineField({name: 'emailInvalidMessage', title: 'Email ugyldig-besked', type: 'string', initialValue: 'Indtast en gyldig emailadresse', group: 'validation'}),
    defineField({name: 'messageRequiredMessage', title: 'Besked påkrævet-besked', type: 'string', initialValue: 'Besked er påkrævet', group: 'validation'}),
    defineField({name: 'genericErrorMessage', title: 'Generisk fejl-besked', type: 'string', initialValue: 'Noget gik galt.', group: 'validation'}),
    defineField({name: 'networkErrorMessage', title: 'Netværksfejl-besked', type: 'string', initialValue: 'Netværksfejl. Prøv venligst igen.', group: 'validation'}),

    // Submit & states
    defineField({name: 'submitLabel', title: 'Send-knap tekst', type: 'string', initialValue: 'Send besked', group: 'states'}),
    defineField({name: 'submittingLabel', title: 'Sender…-tekst', type: 'string', initialValue: 'Sender…', group: 'states'}),
    defineField({name: 'successEyebrow', title: 'Succes øjenbryn', type: 'string', initialValue: 'Tak for din besked', group: 'states'}),
    defineField({name: 'successHeading', title: 'Succes overskrift', type: 'string', initialValue: 'Vi vender tilbage hurtigst muligt', group: 'states'}),
    defineField({
      name: 'successBodyPrefix',
      title: 'Succes brødtekst (før telefonnummer)',
      type: 'string',
      initialValue: 'Du er også velkommen til at ringe til os på ',
      group: 'states',
    }),
    defineField({
      name: 'successBodySuffix',
      title: 'Succes brødtekst (efter telefonnummer)',
      type: 'string',
      initialValue: '.',
      group: 'states',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: `Kontaktsektion: ${title || 'Uden overskrift'}`}
    },
  },
})
