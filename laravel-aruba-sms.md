---
meta:
  - name: description
    content: This package makes it easy to send SMS notifications using SMS Aruba API with Laravel.
gitName: laravel-aruba-sms
---

# laravel-aruba-sms

This package makes it easy to send SMS notifications using SMS Aruba API with Laravel.

[![Github](./assets/icon/github.svg "Github Icon")](https://github.com/offline-agency/laravel-aruba-sms)
[![Latest Stable Version](https://poser.pugx.org/offline-agency/laravel-aruba-sms/v/stable)](https://packagist.org/packages/offline-agency/laravel-aruba-sms)
[![Total Downloads](https://img.shields.io/packagist/dt/offline-agency/laravel-aruba-smsc.svg?style=flat-square)](https://packagist.org/packages/offline-agency/laravel-aruba-sms)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![codecov](https://codecov.io/gh/offline-agency/laravel-aruba-sms/branch/master/graph/badge.svg?token=0BHADJQYAW)](https://codecov.io/gh/offline-agency/laravel-aruba-sms)

## Installation

You can install the package via composer:

```bash
composer require offline-agency/laravel-aruba-sms
```

## Usage

### Notification

Laravel notifications system is a way to notify users via email or SMS.
Each notification is represented by a single class that is typically stored
in the ```app/Notifications``` directory.

Here is an example:

```
<?php

namespace OfflineAgency\LaravelArubaSms\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class SendSmsNotification extends Notification
{
    use Queueable;

    public $message;
    public $recipient;
    public $message_type;

    public function __construct(
        $message,
        $recipient
    )
    {
        $this->setMessage(
            $message
        );

        $this->setRecipient(
            $recipient
        );

        $this->setMessageType();
    }

    public function via(
        $notifiable
    ): array
    {
        return [
            'aruba-sms'
        ];
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function setMessage(
        $message
    ): void
    {
        $this->message = $message;
    }

    public function getRecipient()
    {
        return $this->recipient;
    }

    public function setRecipient(
        $recipient
    ): void
    {
        $this->recipient = $recipient;
    }

    public function getMessageType()
    {
        return $this->message_type;
    }

    public function setMessageType(): void
    {
        $this->message_type = config('aruba.message_type');
    }
}
```

Every notification class has a `via` method that determines on which channels the
notification will be delivered, in this case `aruba-sms`.

The `via` method also receives a **$notifiable** instance, which will be an instance of
the class to which the notification is being sent.

Then set the two variables in question, **$message** and **$recipient**.

### Commands

First of all, to create a new command, you may use the `make:command` Artisan command.

After generating your command, you should define appropriate values for the **signature** and 
**description** properties of the class.

Let’s take `ArubaSmsCommand` as an example:

```
protected $signature = 'aruba:sms {command_type} {--from=} {--to=} {--pageNumber=} {--pageSize=} {--recipient=} {--phoneNumber=*}';

protected $description = '';
```

The handle method will be called when your command is executed.

```
public function handle()
{
    $argument = $this->argument('command_type');
    switch ($argument) {
        case 'status':
            $this->checkArubaSmsStatus();
            break;
        case 'history':
            $this->checkArubaSmsHistory();
            break;
        case 'recipient-history':
            $this->checkArubaSmsRecipientHistory();
            break;
        case 'notification':
            $this->testSendSms();
            break;
        default:
            $this->warn('Command type not valid');
    }
}
```

The method to check aruba sms status is as follows:

```
public function checkArubaSmsStatus(): string
{
    $aruba_sms_service = new ArubaSmsService;

    $response = $aruba_sms_service->checkSmsStatus();

    return $this->getStatusMessage(
        $response
    );
}
```

To start the command run:

```
php artisan aruba:sms status
```

The method to check aruba sms history is as follows:

```
public function checkArubaSmsHistory(): string
{
    $aruba_sms_service = new LaravelArubaSms;

    $from = !is_null($this->option('from')) ? $this->option('from') : $this->getFromDate();
    $to = $this->option('to');
    $pageNumber = $this->option('pageNumber');
    $pageSize = $this->option('pageSize');

    $response = $aruba_sms_service->getSmsHistory(
        $from,
        $to,
        $pageNumber,
        $pageSize
    );

    $status = $response->status();
    if ($status === 200) {
        $message = 'History API return "' . $status . '" - ' . $response->body();
        $this->info($message);
    } else {
        $message = 'History API return "' . $status . '" - ' . $response->body();
        $this->error($message);
    }

    return $response->body();
}
```

To start the command run:

```
php artisan aruba:sms history
```

The method to check aruba sms recipient-history is as follows:

```
public function checkArubaSmsRecipientHistory()
{
    if (!is_null($this->option('recipient'))) {
        $aruba_sms_service = new LaravelArubaSms;

        $recipient = $this->option('recipient');
        $from = !is_null($this->option('from')) ? $this->option('from') : $this->getFromDate();
        $to = $this->option('to');
        $pageNumber = $this->option('pageNumber');
        $pageSize = $this->option('pageSize');

        $response = $aruba_sms_service->getSmsRecipientHistory(
            $recipient,
            $from,
            $to,
            $pageNumber,
            $pageSize
        );

        $status = $response->status();
        if ($status === 200) {
            $message = 'Recipient History API return "' . $status . '" - ' . $response->body();
            $this->info($message);
        } else {
            $message = 'Recipient History API return "' . $status . '" - ' . $response->body();
            $this->error($message);
        }
    } else {
        $this->error('Missing require parameter "recipient". Please see project docs.');
    }
}
```

To start the command run:

```
php artisan aruba:sms recipient-history
```

The method to test the sending of sms is as follows

```
public function testSendSms()
{
    if (
       !is_null($this->option('phoneNumber')) &&
       !empty($this->option('phoneNumber'))
    ) {
        $phoneNumbers = $this->option('phoneNumber');
        $recipient = [];
        $message = 'Sms from console command';
        foreach ($phoneNumbers as $phoneNumber) {
            $phoneNumber = Str::contains($phoneNumber, '+39') ? $phoneNumber : '+39' . $phoneNumber;
            if (Str::contains($phoneNumber, ' ')) {
                $phoneNumber = str_replace(
                    ' ',
                    '',
                    $phoneNumber
                );
            }
            array_push(
                $recipient,
                $phoneNumber
            );
        }

        $user = new User;
        Notification::send(
            $user,
            new SendSmsNotification(
                $message,
                $recipient
            )
        );
    } else {
        $this->error('Missing require parameter "phoneNumber". Please see project doc.');
    }
}
```

To start the command run:

```
php artisan aruba:sms notification
```

## Testing

```bash
composer test
```

### Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please email support@offlineagency.it instead of using the issue tracker.

## Credits

-   [Offline Agency](https://github.com/offline-agency)
-   [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

## Laravel Package Boilerplate

This package was generated using the [Laravel Package Boilerplate](https://laravelpackageboilerplate.com).
