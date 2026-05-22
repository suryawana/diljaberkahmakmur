<?php

// database/migrations/2024_01_01_000001_create_companies_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('about')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->text('description')->nullable();
            $table->string('whatsapp_number');
            $table->text('whatsapp_message')->nullable();
            $table->json('social_media')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('companies');
    }
};
