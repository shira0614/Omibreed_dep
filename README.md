# Omibreed - Istruzioni per l'uso

La piattaforma Omibreed presenta funzionalità diverse a seconda del ruolo dell'utente che vi accede. 

Di seguito sono elencate le funzionalità disponibili per ciascun ruolo.

## Utente non autenticato
Se l'utente non è autenticato, verrà portato alla schermata di Login, dove potrà inserire username e password per accedere al proprio account. La registrazione di nuovi utenti è permessa solo all'amministratore di sistema.

## Utente Coltivatore
L'utente con ruolo Coltivatore ha accesso alle sezioni "Colture" e "Analisi".

Nella sezione "Colture" l'utente può:
- Visualizzare la lista delle proprie colture nella sezione "Colture".
- Aggiungere una nuova coltura cliccando sul pulsante "Aggiungi nuova coltura". Si aprirà una finestra in cui l'utente può inserire i dati della nuova coltura. Attualmente le cultivar disponibili sono Leccino, Frantoio, Moraiolo. Una volta completata l'aggiunta della coltura, ad essa verrà assegnato un ID univoco che indica nell'ordine: la cultivar, l'ordine di aggiunta, se la coltura è inoculata o meno.
- Visualizzare i dettagli di una coltura cliccando sul relativo pulsante. Si aprirà una finestra con i dettagli della coltura selezionata, nonché la lista delle sue repliche. Tramite il pulsante "+" è possibile aggiungere una nuova replica, la quale erediterà gli attributi della pianta madre e il cui ID specifica l'ordine di aggiunta tra le repliche. Per ogni replica è possibile compilare una richiesta di analisi tramite il pulsante "Compila Analisi". Si aprirà una finestra dove è possibile specificare i laboratori destinatari e altre informazioni utili (note, immagini, documenti). Si noti che, se si manda la richiesta di analisi a più laboratori, verranno create tante richieste di analisi quante sono i laboratori destinatari. 

Nella sezione "Analisi" l'utente può:
- Visualizzare le proprie richieste di analisi cliccando sulla sezione "In Attesa". Qui sono raccolte le analisi che non sono state riscontrate dai laboratori destinatari.
- Visualizzare le analisi accettate o rifiutate dai laboratori destinatari cliccando sulla sezione "Nuove". 
- Visualizzare le analisi terminate cliccando sulla sezione "Completate". Cliccando sul pulsante "Scarica Analisi" è possibile scaricare l'esito di un'analisi. Le analisi che non sono mai state visionate sono contrassegnate da un pallino rosso sopra il pulsante "Scarica Analisi".

## Utente Laboratorio
L'utente con ruolo Laboratorio ha accesso alle sezioni "Richieste" e "Analisi In Corso".

Nella sezione "Richieste" l'utente può visualizzare le richieste di analisi pervenutegli e accettarle o rifiutarle. Se una richiesta viene accettata, la relativa analisi passerà alla sezione "Analisi In Corso" e ne verranno scaricati i relativi documenti. Se una richiesta viene rifiutata, la richiesta verrà eliminata e il richiedente la vedrà contrassegnata come rifiutata.

Nella sezione "Analisi In Corso" l'utente può visualizzare le analisi accettate e che sono in corso di svolgimento. I risultati delle analisi possono essere restituiti al richiedente tramite il pulsante "Compila". Si noti che per restituire un'analisi è obbligatorio inserire un documento. Nel caso in cui si voglia ritirare l'accettazione di una richiesta, è possibile farlo tramite il pulsante "Ritira", il quale riporterà la richiesta nella sezione "Richieste".



