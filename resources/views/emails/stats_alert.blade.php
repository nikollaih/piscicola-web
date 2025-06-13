<h1>Alerta: No se han detectado lecturas</h1>

<p>La última lectura fue:</p>

<ul>
    <li>ID: {{ $stat->id }}</li>
    <li>Cosecha: {{ $stat->Sowing->name }}</li>
    <li>Estanque: {{ $stat->Sowing->Pond->name }}</li>
    <li>Hora: {{ \Carbon\Carbon::parse($stat->topic_time)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s') }}</li>
</ul>
