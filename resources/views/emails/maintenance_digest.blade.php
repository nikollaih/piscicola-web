@php use Carbon\Carbon; @endphp
<h2>Mantenimientos próximos ({{ $productiveUnit->name }})</h2>
<p>Se listan los estanques con mantenimiento vencido o dentro de {{ $daysAhead }} días.</p>

<table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
    <thead>
    <tr>
        <th align="left">Estanque</th>
        <th align="left">Sensor</th>
        <th align="left">Próximo mantenimiento</th>
        <th align="left">Estado</th>
    </tr>
    </thead>
    <tbody>
    @forelse($items as $it)
        @php
            $date = Carbon::parse($it['next_maintenance_at'])->format('Y-m-d H:i');
        @endphp
        <tr>
            <td>{{ $it['pond_name'] }}</td>
            <td>{{ $it['sensor_name'] }}</td>
            <td>{{ $date }}</td>
            <td>
                @if($it['overdue'])
                    <strong style="color:#c00;">Vencido</strong>
                @else
                    Próximo
                @endif
            </td>
        </tr>
    @empty
        <tr><td colspan="4">Sin mantenimientos próximos.</td></tr>
    @endforelse
    </tbody>
</table>
