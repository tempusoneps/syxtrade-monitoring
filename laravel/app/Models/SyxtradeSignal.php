<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyxtradeSignal extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'syxtrade_signals';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'cs_time',
        'cs_time_utc',
        'open',
        'high',
        'low',
        'close',
        'volume',
        'ema_signal',
        'couple_cs_signal',
        'momentum_signal',
        'macd_reverse_signal',
        'daily_peak_proba',
        'daily_peak_proba_threshold',
        'daily_valley_proba',
        'daily_valley_proba_threshold',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'cs_time' => 'datetime',
        'cs_time_utc' => 'datetime',
        'open' => 'float',
        'high' => 'float',
        'low' => 'float',
        'close' => 'float',
        'volume' => 'float',
        'daily_peak_proba' => 'float',
        'daily_peak_proba_threshold' => 'float',
        'daily_valley_proba' => 'float',
        'daily_valley_proba_threshold' => 'float',
    ];
}
