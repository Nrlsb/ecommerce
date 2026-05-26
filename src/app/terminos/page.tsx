'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Search, 
    Printer, 
    Scale, 
    ShieldAlert, 
    ChevronRight, 
    BookOpen,
    Info
} from 'lucide-react';
import Link from 'next/link';

// Datos de los términos y condiciones transcriptos exactamente como los proveyó el usuario.
const SECTIONS = [
    {
        id: "introduccion",
        number: "",
        title: "Términos y Condiciones Generales",
        content: "Términos y condiciones de uso de los sitios web de Pinturerías Mercurio. Los términos y condiciones generales referidos a continuación, rigen exclusivamente las relaciones contractuales entre todo usuario, registrado o no (denominado en adelante “Usuario”) que accede al Sitio Web www.pintureriasmercurio.com.ar (en adelante \"Website”) y el propietario del Sitio Web, que es VILLATA RAÚL, con C.U.I.T. N° 20-11790771-7 y domicilio en Alberdi 1539, Esperanza, Pcia. de Santa Fe., República Argentina (en adelante \"la Empresa\"). El Usuario que accede a Website está obligado a conocer, aceptar y se compromete a respetar los Términos y Condiciones Generales. En consecuencia, todas las visitas y cada uno de los contratos y transacciones que se realicen en este sitio, como asimismo sus efectos jurídicos, entre los Usuarios y Pinturerías Mercurio, quedarán regidos por estas reglas y sometidas a la legislación aplicable en la República Argentina. IMPORTANTE: Antes de cada contratación, el Usuario deberá leer, entender y aceptar todas las condiciones establecidas en los Términos y Condiciones Generales y en las Políticas de Privacidad de Pinturerías Mercurio."
    },
    {
        id: "1",
        number: "1",
        title: "Aceptación Términos y Condiciones",
        content: "Los presentes Términos y Condiciones tienen carácter obligatorio y vinculante. Se aplican exclusivamente a todas las compras y actividades realizadas mediante el Website, no a las adquisiciones realizadas de modo presencial en alguno de los locales de Pinturerías Mercurio. El uso del Sitio implica el conocimiento y la aceptación de ellos. Si usted no está de acuerdo con los Términos y Condiciones, deberá abstenerse de utilizar el Website and/o los servicios por él ofrecidos. Por “Usuario” del Website se entiende a todas aquellas personas que utilicen el Website, estén o no registrados en el mismo."
    },
    {
        id: "2",
        number: "2",
        title: "Modificación de los Términos y Condiciones",
        content: "Pinturerías Mercurio podrá, a su exclusivo criterio, sustituir o modificar los Términos y Condiciones en cualquier momento, sin necesidad de requerir el consentimiento de los Usuarios. Para las transacciones en curso que hayan comenzado con anterioridad a dichas modificaciones, subsistirán las condiciones vigentes al momento de su concertación, a menos que las nuevas modificaciones introducidas fueran más convenientes para el Usuario. Los Términos y Condiciones, así como sus modificaciones son vigentes en forma inmediata a su publicación en el Website. En caso de no aceptar algún cambio o modificación en las Condiciones de Uso, deberá cesar inmediatamente en la utilización del Sitio y/o los Servicios."
    },
    {
        id: "3",
        number: "3",
        title: "Capacidad",
        content: "Para utilizar los servicios del Website se requiere tener capacidad legal para contratar conforme lo establecido por la normativa vigente. No podrán acceder a los servicios quienes carezcan de ella, los que hayan sido suspendidos o inhabilitados, ni los menores de edad. Los padres, tutores o responsables de los menores de edad o incapaces que utilicen el Website serán responsables por dicho uso, incluyendo cualquier cargo, facturación o daño que se derive de él. En caso de actuar en representación de una persona jurídica, el usuario debe contar con capacidad para contratar a nombre de tal entidad y de obligar a la misma en los términos de este documento. Si el Usuario no contare con tales facultades, o actuare en exceso de las mismas, se entenderá que se ha comprometido también a título personal."
    },
    {
        id: "4",
        number: "4",
        title: "Registración",
        content: "Los Usuarios pueden navegar libremente por el Website. Se sugiere estar registrados para poder realizar alguna compra, pero también se podrá realizar como invitado sin la necesidad de registrarse. La registración de los Usuarios se realiza ingresando al Website, y no tiene costo alguno. Para registrarse, es obligatorio completar el formulario de registración en todos los campos con datos válidos y verdaderos, de manera exacta y precisa. Para un correcto funcionamiento del sistema, es necesario que los Usuarios mantengan sus datos actualizados en el Website. Pinturerías Mercurio podrá proceder a verificar la identidad del Usuario y/o de los datos consignados por éste. Pinturerías Mercurio no se responsabiliza por la veracidad o certeza de los datos provistos por los Usuarios. Asimismo, Pinturerías Mercurio se reserva el derecho de suspender temporal o definitivamente a los Usuarios en caso de incumplimiento de los Términos y Condiciones, como así también de rechazar solicitudes y/o pedidos realizados. Los Usuarios accederán a su Cuenta Personal (la “Cuenta”) mediante un nombre de Usuario y una clave personal que deberán escoger. En caso de que estos datos sean olvidados por el Usuario, Pinturerías Mercurio cuenta con un servicio de ayuda para recuperarlos. Para esto se deberá hacer “click” en la opción correspondiente e ingresar el e-mail que se proporcionó al momento de la registración. Al finalizar, el sistema le enviará de manera confidencial a esa cuenta su nombre de Usuario y la clave personal. Así como Pinturerías Mercurio se compromete a mantener la confidencialidad de los datos aportados por los Usuarios para su registro, los Usuarios se comprometen a mantener la confidencialidad de su nombre y clave de acceso. De conformidad con lo expresado en el párrafo anterior, los Usuarios son responsables del uso que se haga de su clave y deberán tener presente que si otras personas tienen o pueden tener en el futuro acceso a la cuenta de e-mail consignada como propia en el formulario de registración, éstas también podrían solicitar su clave de acceso y nombre de Usuario. Es obligación exclusiva del Usuario tomar las medidas pertinentes para que esto no suceda. El Usuario se compromete a notificar inmediatamente y de manera fehaciente a Pinturerías Mercurio cualquier uso no autorizado de su Cuenta de Usuario, y a mantenerlo indemne en el caso de que esto produzca algún daño a la Empresa o a terceros. pintureriasrex.com se reserva el derecho de rechazar cualquier solicitud de registración o de cancelar una registración previamente aceptada, sin que esté obligado a comunicar o exponer las razones de su decisión y sin que ello genere algún derecho a indemnización o resarcimiento a favor del Usuario."
    },
    {
        id: "5",
        number: "5",
        title: "Interrupción del Servicio",
        content: "Pinturerías Mercurio se reserva el derecho de interrumpir, suspender o modificar en cualquier momento los servicios ofrecidos en el presente Website, ya sea en forma permanente o transitoria. No se requerirá la conformidad de los Usuarios, ni será necesario aviso previo alguno. Asimismo, Pinturerías Mercurio no garantiza la funcionalidad ni el acceso o uso permanente del Website, que podría interrumpirse por cuestiones técnicas ajenas a Pinturerías Mercurio. Pinturerías Mercurio no garantiza que el Website se encuentre libre de virus o cualquier otro elemento que pueda llegar a dañar o alterar el normal funcionamiento de un ordenador. Es responsabilidad y obligación exclusiva del Usuario contar con las herramientas adecuadas para detectar, desinfectar y/o prevenir cualquier tipo de elementos y/o posibles daños de esta naturaleza. Pinturerías Mercurio no se responsabiliza por cualquier daño que pueda producirse en los equipos informáticos de los Usuarios o de terceros como consecuencia de la navegación del presente Website."
    },
    {
        id: "6",
        number: "6",
        title: "Política de Privacidad",
        content: "Para poder utilizar el Website de manera eficiente y segura, los Usuarios deberán aportar ciertos datos, entre ellos, su nombre y apellido, domicilio, cuenta de e-mail, documento de identidad, fecha de nacimiento, sin los cuales se tornaría imposible brindar los servicios. Por eso se requiere que éstos sean verdaderos y exactos. Los datos recabados por los formularios correspondientes serán incorporados a una base de la cual es responsable Pinturerías Mercurio. La información personal que los Usuarios ingresan en el Website es totalmente confidencial y Pinturerías Mercurio hará su mejor esfuerzo para proteger la privacidad de los mismos, de conformidad con lo dispuesto en la Ley 25.326. Los Usuarios tienen el derecho de acceder a la información de su Cuenta, y podrán modificar los datos ingresados cuando lo deseen. Cualquier Usuario del Website tendrá derecho a solicitar y obtener información sobre los datos personales que Pinturerías Rex S.A. tenga en su base, quedando la Empresa obligada a proporcionar la información solicitada dentro de los diez días corridos de haber sido intimada fehacientemente. Los Usuarios también podrán ejercer el derecho de rectificación, cuando los datos que se posean fueran incorrectos. Asimismo, los Usuarios podrán requerir en cualquier momento la baja de su solicitud y la eliminación de su Cuenta de la base de datos. Pinturerías Mercurio garantiza a sus Usuarios que utilizará los datos dentro de las pautas establecidas por la Ley 25.326 de Protección de los Datos Personales. En caso de que los datos sean requeridos por la vía legal, administrativa o judicial correspondiente, Pinturerías Mercurio se verá compelida a revelar los mismos a la autoridad solicitante. En la medida en que la legislación y normas de procedimiento lo permitan, Pinturerías Mercurio informará a los Usuarios sobre estos requerimientos. Por el sólo hecho de registrarse en el Website, los Usuarios aceptan que Pinturerías Mercurio tiene derecho a comunicarse con ellos por vía postal, telefónica o electrónica y enviar información que la empresa considere, a su exclusivo criterio, que pueda ser de su interés, incluyendo publicidad e información sobre ofertas y promociones. En caso de que los Usuarios no deseen ser contactados con estos fines, podrán manifestárselo fehacientemente a Pinturerías Mercurio quien procederá a interrumpir este tipo de comunicaciones en el menor tiempo que le sea posible."
    },
    {
        id: "7",
        number: "7",
        title: "Cookies",
        content: "El Website puede utilizar un sistema de seguimiento mediante “cookies”, para que el acceso a la información, al pasar de página en página, se realice con mayor rapidez. También ayuda en algunos casos a identificar a los Usuarios, sin necesidad de solicitarles la clave de acceso una y otra vez. Estas cookies son pequeños archivos que envía la página visitada y se alojan en el disco duro del ordenador, ocupando poco espacio. Se hace saber a los Usuarios que utilizando las opciones de su navegador podrán limitar o restringir según su voluntad el alojamiento de estas “cookies”, aunque es desaconsejable restringirlas totalmente. El sistema podrá recoger información sobre sus preferencias e intereses. En el caso de que esto ocurra, la información será utilizada exclusivamente con fines estadísticos para mejorar los servicios que se prestan en el Website. Pinturerías Mercurio aplicará, en la mayor medida en que sea posible, procedimientos de disociación de la información de modo que los titulares de los datos sean inidentificables."
    },
    {
        id: "8",
        number: "8",
        title: "Disponibilidad y precio de los productos",
        content: "Antes de realizar una compra a través del Website, el Usuario deberá tener en cuenta que los productos seleccionados pueden no encontrarse en stock. Toda compra se encuentra sujeta a disponibilidad."
    },
    {
        id: "9",
        number: "9",
        title: "Imágenes",
        content: "Las imágenes utilizadas para ilustrar la presentación de los productos no responden necesariamente a la presentación normal de cada ítem en todas sus variantes, tamaños o formulaciones. Su uso es ilustrativo, pero, no contractual."
    },
    {
        id: "10",
        number: "10",
        title: "Opciones del Usuario ante productos agotados o demorados",
        content: "En concordancia con el punto anterior, en caso de que el o los productos seleccionados se encontraren agotados o demorados, Pinturerías Mercurio se comunicará con el Usuario y lo invitará a que elija una de las siguientes opciones: Continuar esperando la entrega del producto elegido (en caso de demora); Cancelación de la compra y devolución del importe a través del mismo medio de pago utilizado por el Usuario; Optar por un producto alternativo que le ofrezca Pinturerías Mercurio para el caso particular; Cuando el Usuario opte por cancelar la compra, se devolverá el importe abonado a través del mismo medio de pago utilizado oportunamente por el Usuario. En el caso de que el Usuario opte por el producto alternativo que le ofrece Pinturerías Mercurio, éste deberá contener características iguales o superiores. En ningún caso se le pedirá al Usuario que abone sumas suplementarias o que se haga cargo de las diferencias, salvo que el producto alternativo ofrecido por Pinturerías Mercurio y escogido por el Usuario sea de características ampliamente superiores y costosas al solicitado originalmente por el Usuario. IMPORTANTE: para las situaciones contempladas en este apartado, el Usuario tendrá un plazo de diez días para elegir una de las opciones mencionadas. En caso de que el Usuario guarde silencio al respecto, Pinturerías Mercurio podrá presumir que ha optado por la cancelación de la compra, y procederá a la devolución del importe abonado, ya sea por el medio de pago original, o acreditándolo como Pesos On-Line en la Cuenta."
    },
    {
        id: "11",
        number: "11",
        title: "Devolución del importe abonado",
        content: "En los casos mencionados en el punto anterior en que el Usuario haya optado por la devolución del importe abonado, deberá tener en cuenta que el reintegro puede demorar algunos días, debido a plazos y cuestiones administrativas. Para los casos de devolución vía depósito bancario, la cuenta bancaria deberá estar a nombre del titular de la Cuenta de Usuario desde donde se haya realizado la operación. En caso de que no coincidan las titularidades, se requerirá la expresa autorización del titular de la Cuenta de Usuario como condición indispensable previa al depósito."
    },
    {
        id: "12",
        number: "12",
        title: "Validez de las promociones",
        content: "En el caso de que se realicen ofertas y promociones de productos, éstas tendrán validez para las compras efectuadas durante el período de vigencia de las ofertas y promociones. Los términos y condiciones de las mismas serán comunicados en el Website, y estarán siempre sujetas a la existencia en stock de los productos ofrecidos. Las ofertas y promociones de productos que se ofrezcan a través del Website podrán diferir de aquellas promociones y ofertas que se realicen en las distintas sucursales de Pinturerías Mercurio."
    },
    {
        id: "13",
        number: "13",
        title: "Moneda",
        content: "Todos los precios en el Website están expresados en pesos, moneda de curso legal de la República Argentina."
    },
    {
        id: "14",
        number: "14",
        title: "Impuesto al valor agregado (IVA)",
        content: "Todos los precios expresados en el Website incluyen IVA, salvo que se indique lo contrario."
    },
    {
        id: "15",
        number: "15",
        title: "Medios de pago",
        content: "Los pagos podrán realizarse a través de tarjetas de crédito y la plataforma de pago Mercado Pago Custom. El pago mediante la utilización de la tarjeta de crédito podrá realizarse en un pago o en cuotas, según se indique en el Website. La confirmación de la compra con tarjeta de crédito estará sujeta a la autorización del emisor de la misma. Todos los medios de pago están sujetos a que el importe sea debidamente acreditado y/o verificado. IMPORTANTE: Pinturerías Mercurio no mantiene un vínculo asociativo con las corporaciones titulares de los sistemas de pago autorizados, ni integra un grupo económico junto con las mismas. La utilización de los servicios de pagos ofrecidos por tales entidades se realiza por cuenta y riesgo del usuario o consumidor, no pudiendo en ningún caso imputarse a Pinturerías Mercurio responsabilidad por los hechos u omisiones de tales entidades. Pinturerías Mercurio no accederá a los datos de las tarjetas de crédito u otros medios de pago empleados por el usuario, de modo tal que no garantiza que el tratamiento, almacenamiento y utilización de tales datos sea adecuado y se ajuste a las leyes de protección de datos personales (en Argentina, ley nro. 25326) y/o de defensa de los derechos del usuario o consumidor (en Argentina, ley 24240) y/o de tarjetas de crédito (en Argentina, ley 25065)."
    },
    {
        id: "16",
        number: "16",
        title: "Envío de productos",
        content: "Las entregas se realizarán en la dirección que el Usuario indique. La validez de la misma es de su exclusiva responsabilidad. No se entregarán órdenes a casillas de correo (P.O. Box). El tiempo de entrega depende de la disponibilidad del producto, del tiempo de envío y de la aprobación del medio de pago. Los días que se indiquen son estimativos. Los envíos se realizan dentro del territorio continental de la República Argentina e Isla de Tierra del Fuego, con exclusión de la Antártida e Islas del Atlántico Sud y Provincia de Salta. No se realizan envíos al exterior del país. Al realizar una compra, el Usuario recibirá en su casilla de correo electrónico una confirmación de que la orden de pedido ha sido aceptada, junto a un número de pedido. Para asegurar la máxima eficacia en las entregas, éstas se realizan mediante empresas especializadas. El tiempo de aprobación varía según el medio de pago. En el caso de las tarjetas de crédito, el Usuario deberá verificar que los datos proporcionados para la autorización sean correctos. El tiempo de envío varía según el destino donde se solicite la entrega. Para conocer el radio, criterio, costo y el tiempo que demandará la entrega, el Usuario puede hacer “click” en la opción “Tiempo y Costos de Envío”. El tiempo de entrega de la totalidad de la orden, así como su costo, será informado al Usuario antes de aceptar la compra. En caso de no retirar el/los productos/s detallado/s en la factura emitida al momento de la compra, o de no pedir entrega a domicilio, el cliente dispondrá de un plazo de diez días hábiles para hacerse presente en el punto de venta y retirar el o los productos. Pinturerías Mercurio se reserva la potestad de anular la operación y devolver el precio pagado si el cliente se presentase a retirar el producto una vez vencido el plazo indicado."
    },
    {
        id: "17",
        number: "17",
        title: "Gastos de envío",
        content: "El Usuario será claramente informado de los costos de entrega antes de realizar la compra. Estos costos son calculados en función del peso total y/o el volumen total del envío, así como de la distancia existente entre el domicilio de despacho del producto y el domicilio de entrega. Los costos de envío serán discriminados como ítem separado dentro de la factura. Pinturerías Mercurio está siempre trabajando para mejorar la calidad y el costo de entrega para sus clientes. Por este motivo, dichos costos y las políticas de envío se hallan sujetas a cambio sin previo aviso. En caso de resultar necesario despachar la mercadería a un área aduanera especial, o como mercadería en tránsito por territorio de países limítrofes, la contratación del servicio de despachante de aduanas, así como el pago de aranceles y gastos de almacenamiento en depósito fiscal, correrán por exclusiva cuenta y cargo del cliente."
    },
    {
        id: "18",
        number: "18",
        title: "Horarios de entrega",
        content: "Los productos serán entregados en días hábiles de 8 a 18 hs. Los Usuarios no podrán elegir ni el horario ni el día en que se entregarán el o los productos adquiridos, por lo que se recomienda seleccionar su domicilio laboral como punto de entrega para mayor seguridad. De todos modos, podrán hacerse sugerencias en el campo de observaciones al momento de realizar la compra, las que quedarán supeditadas al circuito de la empresa que tenga a su cargo el envío de los productos. Debe recibir la mercadería el titular de la tarjeta con DNI en mano o una persona autorizada con fotocopia del DNI del titular que realizó la compra."
    },
    {
        id: "19",
        number: "19",
        title: "Domicilio de la entrega",
        content: "La dirección en donde se entregará el producto será la que el Usuario indique. Podrá no coincidir con su domicilio. Es responsabilidad del Usuario completar y revisar cuidadosamente la información relacionada con la entrega, para que el envío de la compra se haga de manera efectiva y puntual. No se realizan envíos a casillas de correo (P.O. Box)."
    },
    {
        id: "20",
        number: "20",
        title: "Cancelación de órdenes de compra",
        content: "El Usuario podrá cancelar una orden, siempre y cuando ésta no haya sido aún despachada. Para esto deberá ponerse en contacto con Pinturerías Mercurio dentro de las 24 horas de realizada la compra a través del envío de un correo electrónico a: info@pintureriamercurio.com.ar. Si la cancelación de la compra es total, se reintegrará el importe en Pesos on-line en la Cuenta de Usuario, o mediante el medio de pago que se utilizó para abonar. Aplican las “condiciones de la mercadería” para aceptación de devolución (ver punto 22)."
    },
    {
        id: "21",
        number: "21",
        title: "Facturación",
        content: "La registración en Pinturerías Mercurio es gratuita. Al adquirir un producto el Usuario deberá pagar el precio publicado y en caso de corresponder los gastos de envío y entrega. La factura electrónica a emitirse será la de consumidor final (comprobantes tipo “B”), siendo esta única modalidad de facturación para la compra on line. La misma será enviada al e-mail informado por el Usuario en el pedido, sin excepción. Pinturerías Mercurio se reserva el derecho de modificar, cambiar, agregar o eliminar los precios vigentes, en cualquier momento, lo cual será publicado en el sitio. Asimismo, Pinturerías Mercurio podrá modificar temporalmente los precios por razón de promociones, siendo efectivas estas modificaciones cuando se haga pública la promoción, o se realice el anuncio y hasta la fecha de su finalización. Pinturerías Mercurio se reserva el derecho de tomar las medidas judiciales y extrajudiciales que estime pertinentes para obtener el pago del monto debido. En caso de haberse facturado cargos que no hubiesen correspondido y/o el Usuario no hubiese recibido la factura electrónica en la dirección de e-mail informado en el pedido, deberá comunicarse con nuestro equipo de Atención al Cliente para resolver el inconveniente suscitado (correo electrónico: info@pintureriamercurio.com.ar)."
    },
    {
        id: "22",
        number: "22",
        title: "Normas para la aceptación de devoluciones (Garantía Total)",
        content: "Pinturerías Mercurio establece las siguientes pautas para la aceptación de devoluciones de mercaderías bajo el sistema denominado \"Garantía total\":\n\na) Condiciones de la mercadería:\n1. El cliente no debe haber utilizado el producto.\n2. En el caso de productos envasados, debe verificarse que el contenido se encuentre intacto.\n3. El producto debe ser restituido en su envase original, con todos sus precintos.\n4. No debe encontrarse vencido el plazo establecido por el fabricante para la utilización del producto. (Este requisito debe ser obviado cuando por error Pinturerías Mercurio hubiese entregado un producto vencido).\n5. No puede tratarse de un color preparado con sistema tintométrico ya que fueron realizados a pedido especial del cliente.\n\nb) Recaudos a cumplir:\n1. La devolución debe ser hecha en la sucursal de Correo Argentino más cercana al domicilio del cliente, enviando la mercadería con destino a Alberdi 1539 - Esperanza - Santa Fe.\n2. El cliente debe presentar al momento de la devolución la factura original de compra, y el remito correspondiente, en caso de habérselo emitido. Las partes acuerdan que la obligación de venta al consumidor de los productos enumerados en el Anexo I no podrá estar sujeta a la compra-venta de otros productos o a cualquier condición no prevista en el presente Convenio.\n\nc) Reintegro del precio:\nen el caso de compras abonadas mediante tarjetas de crédito, débito, entrega de valores o cualquier otro medio de pago que implique el diferimiento en el término de acreditación del precio a favor de Pinturerías Mercurio, el reintegro del precio de la mercadería se hará efectivo dentro de los 3 (tres) días hábiles inmediatos siguientes al de efectiva acreditación del pago. De haberse adquirido las mercaderías conforme a planes de pago en cuotas de carácter promocional, solventados por Pinturerías Mercurio, el reintegro quedará diferido al tercer día hábil inmediato siguiente al de acreditación de la última de las cuotas implicadas en la promoción.\n\nd) Plazos y excepciones:\n1. El plazo de vigencia de la \"Garantía Total\" es de 10 (diez) días corridos, contados a partir de la fecha de entrega de la mercadería. Vencido dicho término no se aceptarán devoluciones, salvo que estuvieren fundadas en defectos del producto adquirido.\n2. Debido a la imposibilidad técnica de comercializar nuevamente este producto, no se aceptarán devoluciones de pinturas coloreadas a pedido del cliente, salvo que la devolución se planteare por defectos del producto y no del color en sí."
    },
    {
        id: "23",
        number: "23",
        title: "Prohibiciones",
        content: "Se les prohíbe terminantemente a los Usuarios: a) enviar comentarios cuyo contenido sea ilegal, obsceno, abusivo, difamatorio, injurioso o contrario a las buenas costumbres (la presente enumeración es meramente ejemplificativa); b) enviar archivos que contengan virus o cualquier otra característica capaz de dañar el funcionamiento de una computadora, del Website o del sistema; c) utilizar el Website para violar cualquier tipo de norma vigente; d) consignar datos falsos al momento de registrarse o realizar una compra, o cualquier otro momento en que les sea requerida cualquier tipo de información o datos personales; e) ofrecer productos o servicios; f) usar programas, software o aparatos automáticos o manuales para monitorear o copiar la información o cualquier tipo de contenido del Sitio sin previo consentimiento de Pinturerías Mercurio."
    },
    {
        id: "24",
        number: "24",
        title: "Declaraciones",
        content: "Pinturerías Mercurio no se hace responsable por la veracidad de la información incorporada al Website por terceros. Tampoco se hace responsable en cuanto haya sido reproducida o comunicada directamente por los Usuarios del Website sin verificación por parte de Pinturerías Mercurio. Si algún Usuario se viera afectado por la información a la que se alude en el párrafo anterior, deberá comunicárselo a Pinturerías Mercurio, por mail o correo postal, a fin de que se proceda a la supresión de la misma."
    },
    {
        id: "25",
        number: "25",
        title: "Derechos reservados. Propiedad Intelectual",
        content: "Todos los derechos del presente Website están reservados y corresponden a Pinturerías Mercurio. El contenido del presente Website, incluyendo, aunque no limitado al texto, logos, gráficos, y todo el diseño en general, así como su base de datos y software, es de propiedad de Pinturerías Mercurio o tiene derecho a usarlo en virtud de licencias de uso otorgadas y se encuentra protegido por las legislación nacional e internacional vigente sobre propiedad intelectual. Si el Usuario considera que en el Website se viola o atenta de algún modo contra derechos de propiedad intelectual de terceros deberá notificarlo a Pinturerías Mercurio en la dirección indicada en los presentes Términos y Condiciones Generales, acompañando toda la información y documentación necesaria que respalde la mencionada consideración."
    },
    {
        id: "26",
        number: "26",
        title: "Denominación social y domicilio",
        content: "La razón social de la empresa es VILLATA RAÚL, con C.U.I.T. N° 20-11790771-7 y domicilio en Alberdi 1539, Esperanza, Pcia. de Santa Fe., República Argentina."
    },
    {
        id: "27",
        number: "27",
        title: "Notificaciones",
        content: "Todas las notificaciones y/o comunicaciones que deban efectuarse por el uso de Website bajo estos Términos y Condiciones Generales, deberán realizarse por escrito: (i) al Usuario: mediante correo electrónico, a la cuenta de correo consignada por éste, o por carta documento, al domicilio declarado en el formulario de registración; (ii) a Pinturerías Mercurio a la cuenta de correo electrónico info@pintureriamercurio.com.ar a su domicilio legal indicado en el punto anterior."
    },
    {
        id: "28",
        number: "28",
        title: "Avisos publicitarios y links",
        content: "Cuando el Usuario hace “click” en avisos publicitarios o links de terceros e ingresa en otros sitios que no pertenecen a Pinturerías Mercurio estará sujeto a los términos y condiciones de dichos sitios. El Usuario deberá leer detenidamente sus políticas de acceso y uso. Pinturerías Mercurio no garantiza la legalidad, actualidad, calidad ni utilidad de los contenidos, operaciones e informaciones que se comuniquen, reproduzcan y/o realicen en sitios enlazados de terceros ni la ausencia de nocividad de tales contenidos o servicios, por lo que el Usuario exime de toda responsabilidad a Pinturerías Mercurio por los contenidos incluidos en los referidos sitios o los servicios que en ellos se brindan o promocionan."
    },
    {
        id: "29",
        number: "29",
        title: "LEY APLICABLE Y JURISDICCIÓN",
        content: "Este contrato será gobernado por y se interpretará según la legislación vigente en la República Argentina. Cualquier conflicto, disputa o divergencia relacionado con este contrato o con el uso que el Usuario haga de este Sitio Web y de las Condiciones de Uso, se someterá a la jurisdicción de los Tribunales Ordinarios de la ciudad de Esperanza, Departamento Las Colonias, Provincia de Santa Fe, con exclusión de cualquier otro fuero o jurisdicción que pudiere corresponder, siendo aplicable esta disposición, aunque el Usuario estuviera realmente domiciliado fuera de los límites de la ciudad de Esperanza provincia de Santa Fe o de la República Argentina, por entenderse que este lugar ha sido el lugar de celebración del presente contrato."
    }
];

export default function TerminosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('introduccion');
    const [matchesCount, setMatchesCount] = useState(0);
    const [tocOpen, setTocOpen] = useState(false);
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Efecto para calcular cuántas secciones coinciden con la búsqueda en tiempo real
    useEffect(() => {
        if (!searchTerm) {
            setMatchesCount(0);
            return;
        }
        const lowerSearch = searchTerm.toLowerCase();
        const count = SECTIONS.filter(
            sec => sec.title.toLowerCase().includes(lowerSearch) || sec.content.toLowerCase().includes(lowerSearch)
        ).length;
        setMatchesCount(count);
    }, [searchTerm]);

    // Función para manejar el scroll dinámico al hacer click en el menú lateral
    const scrollToSection = (id: string) => {
        const element = sectionRefs.current[id];
        if (element) {
            const offset = 100; // Offset para que no tape la cabecera
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
            setTocOpen(false);
        }
    };

    // Observer para resaltar la sección actual que el usuario está leyendo
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

            for (const section of SECTIONS) {
                const el = sectionRefs.current[section.id];
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Función para imprimir
    const handlePrint = () => {
        window.print();
    };

    // Función para resaltar las palabras clave buscadas
    const highlightText = (text: string, search: string) => {
        if (!search) return text;
        const parts = text.split(new RegExp(`(${search})`, 'gi'));
        return (
            <>
                {parts.map((part, index) => 
                    part.toLowerCase() === search.toLowerCase() ? (
                        <mark key={index} className="bg-mercurio-pink/30 dark:bg-mercurio-pink/50 text-foreground px-1 py-0.5 rounded font-medium border-b-2 border-mercurio-pink/80">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    const filteredSections = SECTIONS.filter(sec => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return sec.title.toLowerCase().includes(lowerSearch) || sec.content.toLowerCase().includes(lowerSearch);
    });

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 font-sans antialiased pb-20 print:bg-white print:text-black">
            
            {/* Header decorativo estilo Premium */}
            <div className="relative overflow-hidden py-16 bg-slate-900 border-b border-white/5 print:hidden">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-tr from-mercurio-blue/10 to-mercurio-pink/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white mb-4 text-xs font-semibold uppercase tracking-wider transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
                            </Link>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-mercurio-pink mb-4">
                                <Scale className="w-3.5 h-3.5" />
                                Información Legal
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-display">
                                Términos y Condiciones
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base font-light mt-2 max-w-2xl leading-relaxed">
                                Leé atentamente las condiciones de uso de nuestros servicios y portal web de Pinturerías Mercurio.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimir / Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Barra lateral de navegación / Buscador (Escritorio) */}
                    <div className="lg:col-span-4 space-y-6 print:hidden">
                        
                        {/* Tarjeta de Búsqueda */}
                        <div className="glass bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 p-5 rounded-3xl shadow-sm space-y-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mercurio-pink transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar en los términos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:border-mercurio-pink dark:focus:border-mercurio-pink focus:ring-1 focus:ring-mercurio-pink transition-all font-medium placeholder:text-slate-400"
                                />
                            </div>
                            
                            {searchTerm && (
                                <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                                    <span>Resultados encontrados:</span>
                                    <span className="px-2 py-0.5 bg-mercurio-pink/15 text-mercurio-pink rounded-full">
                                        {matchesCount} {matchesCount === 1 ? 'sección' : 'secciones'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Índice Interactivo (Solo visible en desktop) */}
                        <div className="hidden lg:block sticky top-28 max-h-[calc(100vh-160px)] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <BookOpen className="w-4 h-4" />
                                Índice de Secciones
                            </div>
                            
                            <div className="space-y-1">
                                {SECTIONS.map((sec) => (
                                    <button
                                        key={sec.id}
                                        onClick={() => scrollToSection(sec.id)}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                                            activeSection === sec.id
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md font-bold'
                                                : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        <span className="truncate pr-4">
                                            {sec.number ? `${sec.number}. ` : ''}{sec.title}
                                        </span>
                                        <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                                            activeSection === sec.id ? 'opacity-100' : ''
                                        }`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selector móvil (Tabla de contenidos responsive) */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setTocOpen(!tocOpen)}
                                className="w-full py-3.5 px-5 bg-slate-900 dark:bg-slate-900 border border-white/5 rounded-2xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Índice de Contenidos
                                </span>
                                <span>{tocOpen ? 'Cerrar' : 'Ver Índice'}</span>
                            </button>

                            <AnimatePresence>
                                {tocOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-xl max-h-[300px] overflow-y-auto space-y-1 relative z-30"
                                    >
                                        {SECTIONS.map((sec) => (
                                            <button
                                                key={sec.id}
                                                onClick={() => scrollToSection(sec.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                                    activeSection === sec.id
                                                        ? 'bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white font-bold'
                                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                                }`}
                                            >
                                                {sec.number ? `${sec.number}. ` : ''}{sec.title}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Contenido Completo de Términos */}
                    <div className="lg:col-span-8 space-y-8 print:col-span-12">
                        
                        {/* Bloque IMPORTANTE Destacado */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-mercurio-pink/10 to-mercurio-yellow/5 border border-mercurio-pink/30 p-6 md:p-8 rounded-[2rem] shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-mercurio-pink/20 rounded-2xl text-mercurio-pink flex-shrink-0">
                                <Info className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-foreground text-sm uppercase tracking-widest text-mercurio-pink mb-1.5">
                                    Aviso Importante
                                </h3>
                                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base font-medium leading-relaxed">
                                    Antes de cada contratación, el Usuario deberá leer, entender y aceptar todas las condiciones establecidas en los Términos y Condiciones Generales y en las Políticas de Privacidad de Pinturerías Mercurio.
                                </p>
                            </div>
                        </div>

                        {/* Listado de artículos */}
                        <div className="space-y-6">
                            {filteredSections.length > 0 ? (
                                filteredSections.map((sec) => (
                                    <div
                                        key={sec.id}
                                        ref={(el) => { sectionRefs.current[sec.id] = el; }}
                                        className={`transition-all duration-300 bg-white dark:bg-slate-900 border p-6 md:p-8 rounded-3xl relative overflow-hidden group shadow-sm print:shadow-none print:border-none print:p-2 ${
                                            activeSection === sec.id
                                                ? 'border-mercurio-blue/40 shadow-md ring-1 ring-mercurio-blue/10 dark:ring-white/10'
                                                : 'border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                                        }`}
                                    >
                                        {/* Barra decorativa lateral */}
                                        <div className={`absolute top-0 left-0 w-[4px] h-full transition-transform duration-300 origin-bottom ${
                                            activeSection === sec.id
                                                ? 'bg-gradient-to-b from-mercurio-blue via-mercurio-pink to-mercurio-yellow scale-y-100'
                                                : 'bg-slate-200 dark:bg-slate-800 scale-y-0 group-hover:scale-y-100'
                                        } print:hidden`}></div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                {sec.number && (
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black tracking-wide print:border print:border-slate-300">
                                                        {sec.number}
                                                    </span>
                                                )}
                                                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                                                    {highlightText(sec.title, searchTerm)}
                                                </h2>
                                            </div>
                                            
                                            <div className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-light leading-relaxed whitespace-pre-wrap">
                                                {highlightText(sec.content, searchTerm)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm">
                                    <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">No se encontraron resultados</h3>
                                    <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                                        No encontramos ninguna sección que contenga la palabra "{searchTerm}". Intentá con otro término de búsqueda.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pie de página del documento legal */}
                        <div className="text-center pt-8 border-t border-slate-200 dark:border-white/5 text-slate-500 text-xs space-y-2 print:text-black">
                            <p className="font-semibold">ÚLTIMA ACTUALIZACIÓN: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="font-light max-w-md mx-auto">Este documento constituye el contrato de términos y condiciones generales aplicable al uso de la web y contratación de productos con Pinturerías Mercurio.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
